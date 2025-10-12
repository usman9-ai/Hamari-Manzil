from rest_framework import serializers
from hostels.models import Hostel, Room
from .models import (
    Review, Favorite, InteractionLog, SearchHistory,
    HostelAnalytics, DailyAnalytics, AnalyticsSummary, Report
)
from users.models import User
from django.db.models import Avg

class OwnerInfoSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'profile_picture_url', 'phone', 'verification_status']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

class RoomSearchResultSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source='hostel.name')
    owner = serializers.SerializerMethodField()
    distance = serializers.FloatField(read_only=True)
    facilities = serializers.JSONField()

    class Meta:
        model = Room
        fields = [
            'id', 'hostel_name', 'owner', 'room_type',
            'total_capacity', 'available_capacity', 'rent',
            'security_deposit', 'facilities', 'is_available',
            'verification_status', 'distance'
        ]

    def get_owner(self, obj):
        return OwnerInfoSerializer(obj.hostel.owner).data

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = [
            'latitude', 'longitude', 'radius', 'gender_preference',
            'min_price', 'max_price', 'facilities'
        ]

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


# Analytics Serializers
class HostelAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HostelAnalytics
        fields = ['total_views', 'total_contacts', 'total_favorites', 'last_updated']


class DailyAnalyticsSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")
    
    class Meta:
        model = DailyAnalytics
        fields = ['date', 'views', 'contacts', 'favorites', 'searches_appeared']


class AnalyticsSummarySerializer(serializers.ModelSerializer):
    period_type = serializers.CharField(source='get_period_type_display')
    start_date = serializers.DateField(format="%Y-%m-%d")
    end_date = serializers.DateField(format="%Y-%m-%d")
    
    class Meta:
        model = AnalyticsSummary
        fields = [
            'period_type', 'start_date', 'end_date',
            'total_views', 'total_contacts', 'total_favorites',
            'total_searches', 'conversion_rate'
        ]


class ReportSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'user', 'hostel', 'hostel_name', 'reason',
            'reason_display', 'details', 'status', 'status_display',
            'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'status', 'admin_notes', 'created_at', 'updated_at']


class HostelStatsSerializer(serializers.Serializer):
    """Comprehensive stats for hostel owners"""
    total_stats = HostelAnalyticsSerializer()
    daily_stats = DailyAnalyticsSerializer(many=True)
    weekly_summary = AnalyticsSummarySerializer()
    monthly_summary = AnalyticsSummarySerializer()
    
    # Additional aggregated stats
    avg_daily_views = serializers.FloatField()
    avg_daily_contacts = serializers.FloatField()
    peak_viewing_hours = serializers.DictField()  # hour -> view count
    most_searched_areas = serializers.ListField()  # list of areas where hostel appears in searches
