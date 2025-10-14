from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions, serializers
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Avg, Count, F
from django.db.models.functions import ExtractHour, Sin, Cos, ACos, Radians
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from hostels.models import Hostel, Room
from users.models import User
from .models import (
    Review, Favorite, InteractionLog, SearchHistory,
    HostelAnalytics, DailyAnalytics, AnalyticsSummary
)
from .serializers import (
    ReviewSerializer, FavoriteSerializer, InteractionLogSerializer,
    RoomSearchResultSerializer, SearchHistorySerializer,
    HostelStatsSerializer
)
from .utils import get_hostels_in_radius
from django.db.models import Sum, Count, Avg, Q
from datetime import datetime, timedelta

class HostelSearchView(APIView):
    """
    Search for available rooms based on location and filters.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Validate search parameters
            search_serializer = SearchHistorySerializer(data=request.data)
            if not search_serializer.is_valid():
                return Response({
                    'error': 'Invalid search parameters',
                    'details': search_serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            # Extract and validate required parameters
            try:
                latitude = float(request.data.get('latitude'))
                longitude = float(request.data.get('longitude'))
                radius = float(request.data.get('radius', 5))  # default 5km
            except (TypeError, ValueError):
                return Response({
                    'error': 'Invalid coordinate or radius format',
                    'details': 'Latitude, longitude, and radius must be valid numbers'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Extract optional parameters
            gender = request.data.get('gender_preference')
            min_price = request.data.get('min_price')
            max_price = request.data.get('max_price')
            facilities = request.data.get('facilities', [])

            # Validate price range if provided
            if min_price is not None and max_price is not None:
                try:
                    min_price = float(min_price)
                    max_price = float(max_price)
                    if min_price > max_price:
                        return Response({
                            'error': 'Invalid price range',
                            'details': 'Minimum price cannot be greater than maximum price'
                        }, status=status.HTTP_400_BAD_REQUEST)
                except (TypeError, ValueError):
                    return Response({
                        'error': 'Invalid price format',
                        'details': 'Price values must be valid numbers'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Base query: only available rooms
            try:
                rooms = Room.objects.filter(is_available=True).select_related('hostel', 'hostel__owner')

                # Get hostels within radius using the Haversine formula
                try:
                    hostels = get_hostels_in_radius(latitude, longitude, radius, Hostel.objects.all())
                    if not hostels.exists():
                        return Response({
                            'count': 0,
                            'message': f'No hostels found within {radius}km radius',
                            'results': []
                        }, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({
                        'error': 'Distance calculation failed',
                        'details': str(e)
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                rooms = rooms.filter(hostel__in=hostels)

                # Apply filters
                if gender:
                    rooms = rooms.filter(hostel__gender=gender)

                if min_price is not None:
                    rooms = rooms.filter(rent__gte=min_price)

                if max_price is not None:
                    rooms = rooms.filter(rent__lte=max_price)

                if facilities:
                    # Filter rooms that have all requested facilities
                    for facility in facilities:
                        rooms = rooms.filter(facilities__contains=[facility])

                # Log search history and analytics
                try:
                    search_history = SearchHistory.objects.create(
                        user=request.user,
                        latitude=latitude,
                        longitude=longitude,
                        radius=radius,
                        gender_preference=gender,
                        min_price=min_price,
                        max_price=max_price,
                        facilities=facilities
                    )

                    # Log search appearances in analytics
                    for hostel in hostels:
                        DailyAnalytics.log_search_appearance(hostel.id)

                except Exception as e:
                    # Log the error but don't fail the search
                    print(f"Failed to log search history: {str(e)}")

                # Serialize and return results
                room_count = rooms.count()
                serializer = RoomSearchResultSerializer(rooms, many=True)
                
                return Response({
                    "count": room_count,
                    "message": f"Found {room_count} rooms matching your criteria" if room_count > 0 else "No rooms found matching your criteria",
                    "results": serializer.data
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({
                    'error': 'Database query failed',
                    'details': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({
                'error': 'Unexpected error occurred',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------- Favorites API ----------

class FavoriteListCreateView(generics.ListCreateAPIView):
    """
    GET: List user's favorite hostels
    POST: Add a hostel to favorites
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('hostel')

    def perform_create(self, serializer):
        hostel_id = self.request.data.get('hostel')
        # Check if already favorited
        if Favorite.objects.filter(user=self.request.user, hostel_id=hostel_id).exists():
            raise serializers.ValidationError("This hostel is already in your favorites")
        favorite = serializer.save(user=self.request.user)
        
        # Update analytics
        HostelAnalytics.update_favorites(hostel_id)


class FavoriteDeleteView(generics.DestroyAPIView):
    """
    DELETE: Remove a hostel from favorites
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
        

class HostelFavoritesView(APIView):
    """
    GET: Check if a hostel is favorited by the current user
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, hostel_id):
        is_favorite = Favorite.objects.filter(
            user=request.user,
            hostel_id=hostel_id
        ).exists()
        return Response({
            'is_favorite': is_favorite
        })


# ---------- Reviews API ----------

class ReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List reviews for a hostel
    POST: Create a new review
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        hostel_id = self.request.query_params.get("hostel_id")
        if hostel_id:
            return Review.objects.filter(hostel_id=hostel_id).select_related('user', 'hostel')
        
        # If user is an owner, only show reviews for their hostels
        if self.request.user.role == 'owner':
            return Review.objects.filter(hostel__owner=self.request.user).select_related('user', 'hostel')
        
        # If user is a student, show all reviews
        return Review.objects.all().select_related('user', 'hostel')

    def perform_create(self, serializer):
        hostel_id = self.request.data.get('hostel')
        # Check if user has already reviewed this hostel
        if Review.objects.filter(user=self.request.user, hostel_id=hostel_id).exists():
            raise serializers.ValidationError("You have already reviewed this hostel")
        serializer.save(user=self.request.user)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a review
    PUT/PATCH: Update a review
    DELETE: Delete a review
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
        # Recalculate hostel rating after update
        hostel = serializer.instance.hostel
        avg_rating = Review.objects.filter(hostel=hostel).aggregate(Avg('rating'))['rating__avg']
        hostel.average_rating = avg_rating
        hostel.save()


class OwnerReviewResponseView(APIView):
    """
    POST: Add owner response to a review
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            
            # Check if the current user owns the hostel
            if review.hostel.owner != request.user:
                return Response({
                    'error': 'Permission denied',
                    'message': 'You can only respond to reviews for your own hostels'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Update the review with owner response
            review.owner_response = request.data.get('response', '')
            review.responded_at = timezone.now()
            review.save()
            
            return Response({
                'success': True,
                'message': 'Response added successfully',
                'data': ReviewSerializer(review).data
            }, status=status.HTTP_200_OK)
            
        except Review.DoesNotExist:
            return Response({
                'error': 'Review not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': 'Failed to add response',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------- Contact & Interaction API ----------

class InteractionLogCreateView(generics.CreateAPIView):
    """
    Create a log entry for user-hostel interaction (view/contact)
    """
    serializer_class = InteractionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        hostel_id = self.request.data.get('hostel')
        interaction_type = self.request.data.get('interaction_type')
        
        # If it's a contact interaction, verify user's status
        if interaction_type in ['whatsapp', 'call']:
            user = self.request.user
            hostel = Hostel.objects.get(id=hostel_id)
            
            # Check if user and hostel genders match (for female users)
            if user.gender == 'female' and hostel.gender != 'female':
                raise serializers.ValidationError({
                    'error': 'Safety restriction',
                    'message': 'Female students can only contact female hostels'
                })
            
            # Check if user has verified their phone number
            if not user.phone_verified:
                raise serializers.ValidationError({
                    'error': 'Verification required',
                    'message': 'Please verify your phone number to contact hostel owners'
                })

        serializer.save(user=self.request.user)


class OwnerDashboardView(APIView):
    """
    Get comprehensive dashboard data for hostel owners
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Ensure user is an owner
        if user.role != 'owner':
            return Response(
                {'error': 'Access denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get user's hostels
        user_hostels = Hostel.objects.filter(owner=user)
        user_hostel_ids = user_hostels.values_list('id', flat=True)
        
        # Get user's rooms
        user_rooms = Room.objects.filter(hostel__in=user_hostel_ids)
        
        # Calculate date ranges
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Summary Stats
        total_hostels = user_hostels.count()
        total_rooms = user_rooms.count()
        total_available_beds = user_rooms.aggregate(
            total=Sum('available_capacity')
        )['total'] or 0
        
        verified_hostels = user_hostels.filter(verification_status=True).count()
        verified_rooms = user_rooms.filter(verification_status=True).count()
        unverified_count = (total_hostels - verified_hostels) + (total_rooms - verified_rooms)
        
        # Engagement Stats - All Time
        total_views = InteractionLog.objects.filter(
            hostel__in=user_hostel_ids,
            interaction_type='view'
        ).count()
        
        total_contacts = InteractionLog.objects.filter(
            hostel__in=user_hostel_ids,
            interaction_type__in=['whatsapp', 'call']
        ).count()
        
        total_favorites = Favorite.objects.filter(
            hostel__in=user_hostel_ids
        ).count()
        
        # Reviews
        user_reviews = Review.objects.filter(hostel__in=user_hostel_ids)
        total_reviews = user_reviews.count()
        avg_rating = user_reviews.aggregate(avg=Avg('rating'))['avg'] or 0
        pending_reviews = user_reviews.filter(owner_response__isnull=True).count()
        
        # This Week Stats
        this_week_views = InteractionLog.objects.filter(
            hostel__in=user_hostel_ids,
            interaction_type='view',
            created_at__gte=week_ago
        ).count()
        
        this_week_contacts = InteractionLog.objects.filter(
            hostel__in=user_hostel_ids,
            interaction_type__in=['whatsapp', 'call'],
            created_at__gte=week_ago
        ).count()
        
        this_week_favorites = Favorite.objects.filter(
            hostel__in=user_hostel_ids,
            created_at__gte=week_ago
        ).count()
        
        this_week_reviews = user_reviews.filter(created_at__gte=week_ago).count()
        
        # This Month Stats
        this_month_views = InteractionLog.objects.filter(
            hostel__in=user_hostel_ids,
            interaction_type='view',
            created_at__gte=month_ago
        ).count()
        
        this_month_contacts = InteractionLog.objects.filter(
            hostel__in=user_hostel_ids,
            interaction_type__in=['whatsapp', 'call'],
            created_at__gte=month_ago
        ).count()
        
        this_month_favorites = Favorite.objects.filter(
            hostel__in=user_hostel_ids,
            created_at__gte=month_ago
        ).count()
        
        this_month_reviews = user_reviews.filter(created_at__gte=month_ago).count()
        
        # Recent Activity (last 7 days)
        recent_interactions = []
        for i in range(7):
            date = today - timedelta(days=i)
            day_views = InteractionLog.objects.filter(
                hostel__in=user_hostel_ids,
                interaction_type='view',
                created_at__date=date
            ).count()
            
            day_contacts = InteractionLog.objects.filter(
                hostel__in=user_hostel_ids,
                interaction_type__in=['whatsapp', 'call'],
                created_at__date=date
            ).count()
            
            day_favorites = Favorite.objects.filter(
                hostel__in=user_hostel_ids,
                created_at__date=date
            ).count()
            
            recent_interactions.append({
                'date': date.strftime('%Y-%m-%d'),
                'views': day_views,
                'contacts': day_contacts,
                'favorites': day_favorites
            })
        
        # Top Performing Hostels
        top_hostels = []
        for hostel in user_hostels:
            hostel_views = InteractionLog.objects.filter(
                hostel=hostel,
                interaction_type='view'
            ).count()
            
            hostel_contacts = InteractionLog.objects.filter(
                hostel=hostel,
                interaction_type__in=['whatsapp', 'call']
            ).count()
            
            hostel_reviews = Review.objects.filter(hostel=hostel)
            hostel_avg_rating = hostel_reviews.aggregate(avg=Avg('rating'))['avg'] or 0
            conversion_rate = (hostel_contacts / hostel_views * 100) if hostel_views > 0 else 0
            
            top_hostels.append({
                'id': hostel.id,
                'name': hostel.name,
                'views': hostel_views,
                'contacts': hostel_contacts,
                'conversion_rate': round(conversion_rate, 1),
                'avg_rating': round(hostel_avg_rating, 1)
            })
        
        # Sort by views and take top 5
        top_hostels = sorted(top_hostels, key=lambda x: x['views'], reverse=True)[:5]
        
        # Verification Status
        user_verified = user.verification_status
        hostels_pending = total_hostels - verified_hostels
        rooms_pending = total_rooms - verified_rooms
        
        # Action Items
        rooms_low_availability = user_rooms.filter(available_capacity__lt=2).count()
        
        return Response({
            # Summary Stats
            'total_hostels': total_hostels,
            'total_rooms': total_rooms,
            'total_available_beds': total_available_beds,
            'verified_hostels': verified_hostels,
            'verified_rooms': verified_rooms,
            'unverified_count': unverified_count,
            
            # Engagement Stats
            'total_views': total_views,
            'total_contacts': total_contacts,
            'total_favorites': total_favorites,
            'total_reviews': total_reviews,
            'avg_rating': round(avg_rating, 1),
            'pending_reviews': pending_reviews,
            
            # This Week Stats
            'this_week': {
                'views': this_week_views,
                'contacts': this_week_contacts,
                'favorites': this_week_favorites,
                'reviews': this_week_reviews
            },
            
            # This Month Stats
            'this_month': {
                'views': this_month_views,
                'contacts': this_month_contacts,
                'favorites': this_month_favorites,
                'reviews': this_month_reviews
            },
            
            # Recent Activity
            'recent_interactions': recent_interactions,
            
            # Top Performing Hostels
            'top_hostels': top_hostels,
            
            # Verification Status
            'verification_status': {
                'user_verified': user_verified,
                'hostels_verified': verified_hostels,
                'hostels_pending': hostels_pending,
                'rooms_verified': verified_rooms,
                'rooms_pending': rooms_pending
            },
            
            # Action Items
            'action_items': {
                'pending_reviews': pending_reviews,
                'unverified_hostels': hostels_pending,
                'unverified_rooms': rooms_pending,
                'rooms_low_availability': rooms_low_availability
            }
        })


class HostelAnalyticsView(APIView):
    """
    Get detailed analytics for a specific hostel
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, hostel_id):
        user = request.user
        
        # Ensure user is an owner and owns this hostel
        if user.role != 'owner':
            return Response(
                {'error': 'Access denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            hostel = Hostel.objects.get(id=hostel_id, owner=user)
        except Hostel.DoesNotExist:
            return Response(
                {'error': 'Hostel not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get analytics data for this hostel
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # All time stats
        total_views = InteractionLog.objects.filter(
            hostel=hostel,
            interaction_type='view'
        ).count()
        
        total_contacts = InteractionLog.objects.filter(
            hostel=hostel,
            interaction_type__in=['whatsapp', 'call']
        ).count()
        
        total_favorites = Favorite.objects.filter(hostel=hostel).count()
        
        # Reviews
        reviews = Review.objects.filter(hostel=hostel)
        total_reviews = reviews.count()
        avg_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
        pending_reviews = reviews.filter(owner_response__isnull=True).count()
        
        # Recent activity (last 30 days)
        recent_activity = []
        for i in range(30):
            date = today - timedelta(days=i)
            day_views = InteractionLog.objects.filter(
                hostel=hostel,
                interaction_type='view',
                created_at__date=date
            ).count()
            
            day_contacts = InteractionLog.objects.filter(
                hostel=hostel,
                interaction_type__in=['whatsapp', 'call'],
                created_at__date=date
            ).count()
            
            day_favorites = Favorite.objects.filter(
                hostel=hostel,
                created_at__date=date
            ).count()
            
            recent_activity.append({
                'date': date.strftime('%Y-%m-%d'),
                'views': day_views,
                'contacts': day_contacts,
                'favorites': day_favorites
            })
        
        # Conversion rate
        conversion_rate = (total_contacts / total_views * 100) if total_views > 0 else 0
        
        return Response({
            'hostel': {
                'id': hostel.id,
                'name': hostel.name,
                'city': hostel.city,
                'verification_status': hostel.verification_status
            },
            'analytics': {
                'total_views': total_views,
                'total_contacts': total_contacts,
                'total_favorites': total_favorites,
                'conversion_rate': round(conversion_rate, 1),
                'total_reviews': total_reviews,
                'avg_rating': round(avg_rating, 1),
                'pending_reviews': pending_reviews
            },
            'recent_activity': recent_activity
        })
