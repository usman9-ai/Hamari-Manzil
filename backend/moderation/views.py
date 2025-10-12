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
        User submits profile picture and CNIC for admin review.
        WhatsApp verification removed for now - will be added later.
        """
        # Validate required fields
        if not request.data.get('profile_image') or not request.data.get('cnic_image'):
            return Response(
                {'error': 'Both profile_image and cnic_image are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create verification request
        verification = VerificationRequest.objects.create(
            user=request.user,
            request_type='user',
            profile_image=request.data.get('profile_image'),
            cnic_image=request.data.get('cnic_image')
        )
        
        return Response({
            'id': verification.id,
            'status': 'pending',
            'message': 'Verification request submitted. Admin will review your profile and CNIC images.',
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

        hostel = get_object_or_404(Hostel, id=request.data.get('hostel_id'))

        # Check ownership
        if hostel.owner != request.user:
            return Response(
                {'error': 'You can only verify your own hostels'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Create verification request
        verification = VerificationRequest.objects.create(
            user=request.user,
            request_type='hostel',
            hostel=hostel,
            hostel_thumbnail=request.data.get('thumbnail'),
            location_lat=request.data.get('latitude'),
            location_lng=request.data.get('longitude')
        )

        return Response({'id': verification.id})

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

        if not hostel.is_verified:
            return Response(
                {'error': 'Please verify the hostel first'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process room images
        images = request.data.get('images', [])
        processed_images = []
        for img in images:
            processed_images.append({
                'url': img['url'],
                'verified': img['source'] == 'camera'
            })

        # Create verification request
        verification = VerificationRequest.objects.create(
            user=request.user,
            request_type='room',
            hostel=hostel,
            room=room,
            room_images=processed_images
        )

        return Response({'id': verification.id})

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
