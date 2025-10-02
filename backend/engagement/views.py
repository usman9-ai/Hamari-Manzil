from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.db.models import Q
from hostels.models import Hostel, Room
from users.models import User
from .models import Review, Favorite, InteractionLog
from .serializers import (
    HostelSearchSerializer,
    ReviewSerializer,
    FavoriteSerializer,
    InteractionLogSerializer,
)
import math


# ---------- Helpers ----------

def parse_location(location_str):
    """Convert 'lng,lat' string into floats"""
    try:
        location_str = location_str.strip("()")
        coords = location_str.split(",")
        return float(coords[0]), float(coords[1])
    except:
        return None, None


def haversine(lat1, lon1, lat2, lon2):
    """Return distance in km between two points"""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    print("Distance:", R * c)
    return R * c


def filter_by_bbox(qs, min_lat, max_lat, min_lng, max_lng):
    filtered_ids = []
    for hostel in qs:
        lat, lng = parse_location(hostel.location)
        if lat is not None and lng is not None:
            if min_lat <= lat <= max_lat and min_lng <= lng <= max_lng:
                filtered_ids.append(hostel.id)
    return qs.filter(id__in=filtered_ids)


def filter_by_radius(qs, user_lat, user_lng, radius_km):
    distance_in_km = {}
    filtered_ids = []
    for hostel in qs:
        lat, lng = parse_location(hostel.map_location)
        print("Hostel Coords:", hostel.name, lat, lng)

        if lat is not None and lng is not None:
            print("Calculating distance for:", hostel.name, lat, lng)
            distance = haversine(user_lat, user_lng, lat, lng)
            if distance <= radius_km:
                filtered_ids.append(hostel.id)
                distance_in_km[hostel.id] = round(distance, 2)
    return qs.filter(id__in=filtered_ids), distance_in_km


# ---------- Search API ----------
class HostelSearchView(APIView):
    """Search hostels by query, city, bounding box, or radius"""

    def get(self, request):
        qs = Hostel.objects.all()

        # --- City Filter ---
        city = request.query_params.get("city")
        if city:
            qs = qs.filter(city__icontains=city)

        # --- Nearby Location ---
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius = request.query_params.get("radius")

        if lat and lng and radius:
            qs, distance_in_km = filter_by_radius(qs, float(lat), float(lng), float(radius))
        else:
            distance_in_km = {}

        # ✅ prefetch rooms (efficient)
        qs = qs.prefetch_related("rooms")

        serializer = HostelSearchSerializer(
            qs,
            many=True,
            context={"distance_in_km": distance_in_km}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

# ---------- Favorites API ----------

class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


# ---------- Reviews API ----------

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        hostel_id = self.request.query_params.get("hostel_id")
        if hostel_id:
            return Review.objects.filter(hostel_id=hostel_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


# ---------- Interaction Logs API ----------

class InteractionLogCreateView(generics.CreateAPIView):
    serializer_class = InteractionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
