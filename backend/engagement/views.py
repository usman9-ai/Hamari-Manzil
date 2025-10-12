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
