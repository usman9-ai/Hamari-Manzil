
from rest_framework import serializers
from .models import RoomImage, Hostel, Room, ALLOWED_FACILITIES
from .choices import VALID_FACILITIES, FACILITY_DICT, HOSTEL_FACILITIES

# RoomImage serializer for multiple images per room
class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'uploaded_at']

# serializers.py
from rest_framework import serializers
from .models import Room, Hostel

class RoomSerializer(serializers.ModelSerializer):
    def validate(self, data):
        # Validate capacity
        if 'available_capacity' in data and 'total_capacity' in data:
            if data['available_capacity'] > data['total_capacity']:
                raise serializers.ValidationError({
                    'available_capacity': 'Available capacity cannot exceed total capacity'
                })
        
        # Validate facilities
        if 'facilities' in data:
            facilities = data['facilities']
            if not isinstance(facilities, list):
                raise serializers.ValidationError({
                    'facilities': 'Facilities must be a list'
                })
            
            invalid_facilities = [f for f in facilities if f not in ALLOWED_FACILITIES]
            if invalid_facilities:
                raise serializers.ValidationError({
                    'facilities': f'Invalid facilities: {", ".join(invalid_facilities)}'
                })
        
        # Validate rent and security deposit
        if 'rent' in data and data['rent'] <= 0:
            raise serializers.ValidationError({
                'rent': 'Rent must be greater than 0'
            })
        
        if 'security_deposit' in data and data['security_deposit'] <= 0:
            raise serializers.ValidationError({
                'security_deposit': 'Security deposit must be greater than 0'
            })
        
        return data

    class Meta:
        model = Room
        fields = [
            'id',
            'hostel',
            'media',
            'room_type',
            'total_capacity',
            'available_capacity',
            'rent',
            'security_deposit',
            'facilities',
            'description',
            'is_available',
            'verification_status',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'verification_status']

    def validate_hostel(self, hostel):
        """Ensure that the hostel belongs to the logged-in owner."""
        request = self.context.get("request")
        if hostel.owner != request.user:
            raise serializers.ValidationError("You can only add rooms to your own hostels.")
        return hostel
    

# serializers.py
class RoomDetailSerializer(serializers.ModelSerializer):
    # facilities_display = serializers.SerializerMethodField()
    hostel_name = serializers.CharField(source="hostel.name", read_only=True)
    images = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            "id",
            "description",
            "total_capacity",
            "available_capacity",
            "rent",
            "security_deposit",
            "facilities",
            "media",
            "created_at",
            "room_type",
            "is_available",
            "hostel",
            "hostel_name",
            "images",  # List of all images for this room
        ]

    def get_facilities_display(self, obj):
        if not obj.facilities:
            return []
        return [FACILITY_DICT.get(f, f) for f in obj.facilities]



# -----------------------------
# Hostel Serializer
# -----------------------------
class HostelSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = Hostel
        fields = [
            "id",
            "owner",
            "name",
            "city",
            "latitude",
            "longitude",
            "map_location",
            "gender",
            "total_rooms",
            "description",
            "created_at",
            "rooms",
        ]
        read_only_fields = ["owner"]   # owner is not settable from API input



