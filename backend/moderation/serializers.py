from rest_framework import serializers
from .models import VerificationRequest

class VerificationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRequest
        fields = [
            'id', 'request_type', 'status', 'created_at', 'updated_at',
            'admin_notes', 'user', 'hostel', 'room', 'reviewed_by',
            'profile_image', 'cnic_image', 'hostel_thumbnail', 
            'location_lat', 'location_lng', 'location_verified', 'room_images'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'location_verified', 
            'reviewed_by', 'status'
        ]