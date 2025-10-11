from rest_framework import serializers
from hostels.models import Hostel, Room
from .models import Review, Favorite, InteractionLog
from django.db.models import Avg

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'hostel', 'hostel_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']


class FavoriteSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'hostel', 'hostel_name', 'created_at']
        read_only_fields = ['user', 'created_at']


class InteractionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionLog
        fields = ['id', 'user', 'hostel', 'interaction_type', 'created_at']
        read_only_fields = ['user', 'created_at']


class RoomSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "rent", "media"]  # only Room fields


class HostelSearchSerializer(serializers.ModelSerializer):
    rooms = RoomSearchSerializer(many=True, read_only=True)  # related_name="rooms"
    distance = serializers.SerializerMethodField()

    class Meta:
        model = Hostel
        fields = ["id", "name", "rooms", "distance"]  # include rooms & distance

    def get_distance(self, obj):
        distances = self.context.get("distance_in_km", {})
        return distances.get(obj.id)
