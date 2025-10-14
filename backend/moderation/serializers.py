from rest_framework import serializers
from .models import VerificationRequest

class VerificationRequestSerializer(serializers.ModelSerializer):
    # Computed fields
    is_camera_verified = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)
    room_name = serializers.CharField(source='room.id', read_only=True)
    
    class Meta:
        model = VerificationRequest
        fields = [
            'id', 'request_type', 'status', 'created_at', 'updated_at',
            'admin_notes', 'rejection_reason', 'user', 'user_name', 
            'hostel', 'hostel_name', 'room', 'room_name', 'reviewed_by',
            'profile_image', 'cnic_front', 'cnic_back', 'passport_photo', 'utility_bill',
            'hostel_thumbnail', 'location_lat', 'location_lng', 
            'location_verified', 'room_images', 'is_camera_verified'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'location_verified', 
            'reviewed_by', 'status', 'rejection_reason', 'admin_notes'
        ]
    
    def get_is_camera_verified(self, obj):
        """Check if all room images are camera-captured"""
        if obj.request_type != 'room' or not obj.room_images:
            return None
        
        return all(
            image.get('source') == 'camera' 
            for image in obj.room_images
        )
    
    def validate(self, data):
        """Custom validation based on request type"""
        request_type = data.get('request_type')
        
        if request_type == 'user':
            # User verification requires CNIC images and passport photo
            if not data.get('cnic_front'):
                raise serializers.ValidationError("CNIC front image is required for user verification")
            if not data.get('cnic_back'):
                raise serializers.ValidationError("CNIC back image is required for user verification")
            if not data.get('passport_photo'):
                raise serializers.ValidationError("Passport-size photo is required for user verification")
        
        elif request_type == 'hostel':
            # Hostel verification requires utility bill
            if not data.get('utility_bill'):
                raise serializers.ValidationError("Utility bill document is required for hostel verification")
        
        elif request_type == 'room':
            # Room verification requires camera-captured images
            room_images = data.get('room_images', [])
            if not room_images:
                raise serializers.ValidationError("Room images are required for room verification")
            
            # Check if all images are camera-captured
            for i, image in enumerate(room_images):
                if image.get('source') != 'camera':
                    raise serializers.ValidationError(f"Image {i+1} must be captured using camera, not from gallery")
        
        return data