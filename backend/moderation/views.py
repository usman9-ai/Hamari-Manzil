from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import VerificationRequest
from .serializers import VerificationRequestSerializer
from users.models import User
from hostels.models import Hostel, Room

class VerificationViewSet(viewsets.ModelViewSet):
    queryset = VerificationRequest.objects.all()
    serializer_class = VerificationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter requests based on user role"""
        user = self.request.user
        if user.is_staff:
            return VerificationRequest.objects.all()
        return VerificationRequest.objects.filter(user=user)

    @action(detail=False, methods=['post'])
    def request_user_verification(self, request):
        """
        Start user verification process.
        User submits profile picture and CNIC front/back for admin review.
        """
        # Validate required fields
        if not request.data.get('cnic_front') or not request.data.get('cnic_back') or not request.data.get('passport_photo'):
            return Response(
                {'error': 'CNIC front, back images, and passport photo are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already has a pending user verification
        existing_request = VerificationRequest.objects.filter(
            user=request.user,
            request_type='user',
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {'error': 'You already have a pending user verification request'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create verification request
        verification = VerificationRequest.objects.create(
            user=request.user,
            request_type='user',
            profile_image=request.data.get('profile_image'),
            cnic_front=request.data.get('cnic_front'),
            cnic_back=request.data.get('cnic_back'),
            passport_photo=request.data.get('passport_photo')
        )
        
        return Response({
            'id': verification.id,
            'status': 'pending',
            'message': 'User verification request submitted. Admin will review your CNIC images.',
            'created_at': verification.created_at
        })

    @action(detail=False, methods=['post'])
    def request_hostel_verification(self, request):
        """Start hostel verification process"""
        # Ensure user is verified
        if not request.user.verification_status:
            return Response(
                {'error': 'Please verify your account first'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate required fields
        if not request.data.get('utility_bill'):
            return Response(
                {'error': 'Utility bill document is required for hostel verification'},
                status=status.HTTP_400_BAD_REQUEST
            )

        hostel = get_object_or_404(Hostel, id=request.data.get('hostel_id'))

        # Check ownership
        if hostel.owner != request.user:
            return Response(
                {'error': 'You can only verify your own hostels'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if hostel already has a pending verification
        existing_request = VerificationRequest.objects.filter(
            user=request.user,
            request_type='hostel',
            hostel=hostel,
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {'error': 'This hostel already has a pending verification request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create verification request
        verification = VerificationRequest.objects.create(
            user=request.user,
            request_type='hostel',
            hostel=hostel,
            utility_bill=request.data.get('utility_bill'),
            hostel_thumbnail=request.data.get('thumbnail'),
            location_lat=request.data.get('latitude'),
            location_lng=request.data.get('longitude')
        )

        return Response({
            'id': verification.id,
            'status': 'pending',
            'message': 'Hostel verification request submitted. Admin will review your utility bill document.',
            'created_at': verification.created_at
        })

    @action(detail=False, methods=['post'])
    def request_room_verification(self, request):
        """Start room verification process"""
        room = get_object_or_404(Room, id=request.data.get('room_id'))
        hostel = room.hostel

        # Check hostel ownership and verification
        if hostel.owner != request.user:
            return Response(
                {'error': 'You can only verify rooms in your hostels'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not hostel.verification_status:
            return Response(
                {'error': 'Please verify the hostel first'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate required fields
        images = request.data.get('images', [])
        if not images:
            return Response(
                {'error': 'Room images are required for room verification'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if room already has a pending verification
        existing_request = VerificationRequest.objects.filter(
            user=request.user,
            request_type='room',
            room=room,
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {'error': 'This room already has a pending verification request'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process room images - validate all are camera-captured
        processed_images = []
        for i, img in enumerate(images):
            if img.get('source') != 'camera':
                return Response(
                    {'error': f'Image {i+1} must be captured using camera, not from gallery'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            processed_images.append({
                'url': img['url'],
                'source': img['source'],
                'verified': True  # Camera images are considered verified
            })

        # Create verification request
        verification = VerificationRequest.objects.create(
            user=request.user,
            request_type='room',
            hostel=hostel,
            room=room,
            room_images=processed_images
        )

        return Response({
            'id': verification.id,
            'status': 'pending',
            'message': 'Room verification request submitted. Admin will review your camera-captured images.',
            'created_at': verification.created_at
        })

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a verification request"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can approve verifications'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()
        notes = request.data.get('notes', '')
        verification.approve(request.user, notes)
        
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a verification request"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can reject verifications'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()
        notes = request.data.get('notes', '')
        if not notes:
            return Response(
                {'error': 'Please provide rejection reason'},
                status=status.HTTP_400_BAD_REQUEST
            )

        verification.reject(request.user, notes)
        return Response({'status': 'rejected'})
    
    @action(detail=False, methods=['get'])
    def my_verification_status(self, request):
        """Get current user's verification status for all types"""
        user = request.user
        
        # Get user verification status
        user_verification = VerificationRequest.objects.filter(
            user=user,
            request_type='user'
        ).order_by('-created_at').first()
        
        # Get hostel verification statuses
        hostels = Hostel.objects.filter(owner=user)
        hostel_verifications = {}
        for hostel in hostels:
            verification = VerificationRequest.objects.filter(
                user=user,
                request_type='hostel',
                hostel=hostel
            ).order_by('-created_at').first()
            hostel_verifications[hostel.id] = {
                'hostel_name': hostel.name,
                'status': verification.status if verification else 'not_submitted',
                'rejection_reason': verification.rejection_reason if verification else None,
                'created_at': verification.created_at if verification else None
            }
        
        # Get room verification statuses
        rooms = Room.objects.filter(hostel__owner=user)
        room_verifications = {}
        for room in rooms:
            verification = VerificationRequest.objects.filter(
                user=user,
                request_type='room',
                room=room
            ).order_by('-created_at').first()
            room_verifications[room.id] = {
                'room_id': room.id,
                'hostel_name': room.hostel.name,
                'status': verification.status if verification else 'not_submitted',
                'rejection_reason': verification.rejection_reason if verification else None,
                'created_at': verification.created_at if verification else None
            }
        
        return Response({
            'user_verification': {
                'status': user_verification.status if user_verification else 'not_submitted',
                'rejection_reason': user_verification.rejection_reason if user_verification else None,
                'created_at': user_verification.created_at if user_verification else None
            },
            'hostel_verifications': hostel_verifications,
            'room_verifications': room_verifications
        })
    
    @action(detail=False, methods=['get'])
    def verification_requirements(self, request):
        """Get verification requirements for each type"""
        return Response({
            'user_verification': {
                'required_documents': ['CNIC Front', 'CNIC Back'],
                'file_types': ['jpg', 'jpeg', 'png'],
                'max_file_size': '5MB',
                'description': 'Upload clear images of both sides of your CNIC'
            },
            'hostel_verification': {
                'required_documents': ['Utility Bill or Property Document'],
                'file_types': ['jpg', 'jpeg', 'png', 'pdf'],
                'max_file_size': '10MB',
                'description': 'Upload a utility bill or property document showing the hostel address'
            },
            'room_verification': {
                'required_documents': ['Room Photos (Camera Only)'],
                'file_types': ['jpg', 'jpeg', 'png'],
                'max_file_size': '5MB per image',
                'min_images': 3,
                'max_images': 5,
                'description': 'Take photos of the room using your camera (gallery photos not allowed)'
            }
        })
