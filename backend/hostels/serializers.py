from rest_framework import serializers
from .models import Hostel, Room
from .choices import VALID_FACILITIES, FACILITY_DICT, HOSTEL_FACILITIES

# -----------------------------
# Room Serializer
# -----------------------------
class RoomSerializer(serializers.ModelSerializer):
    # facilities_display = serializers.SerializerMethodField()
    hostel_name = serializers.CharField(source="hostel.name", read_only=True)

    class Meta:
        model = Room
        fields = [
            "id",
            "available_capacity",
            "rent",
            "media",
            "is_available",
            "hostel",
            "hostel_name"
        ]

    def validate_facilities(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Facilities must be a list of keys")
        for f in value:
            if f not in VALID_FACILITIES:
                raise serializers.ValidationError(f"{f} is not a valid facility")
        return value

    def get_facilities_display(self, obj):
        if not obj.facilities:
            return []
        return [FACILITY_DICT.get(f, f) for f in obj.facilities]
    

# serializers.py
class RoomDetailSerializer(serializers.ModelSerializer):
    # facilities_display = serializers.SerializerMethodField()
    hostel_name = serializers.CharField(source="hostel.name", read_only=True)

    class Meta:
        model = Room
        fields = [
            "id",
                    # اگر room title ہے
            "description",          # اگر description ہے
            "total_capacity",
            "available_capacity",
            "rent",
            "security_deposit",
            "facilities",           # اصل stored facilities
       # readable facilities
            "media",
            "created_at",
            "room_type",
            "is_available",
            "hostel",
            "hostel_name",
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
