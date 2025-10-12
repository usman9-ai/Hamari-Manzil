from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Room, RoomImage
from .serializers import RoomImageSerializer
# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hostel, Room
from .serializers import RoomSerializer


# ---------------------------
# Upload multiple images for a room
# ---------------------------
class RoomImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        images = request.FILES.getlist('images')
        image_objs = []
        for img in images:
            image_obj = RoomImage(room=room, image=img)
            image_obj.save()
            image_objs.append(image_obj)
        serializer = RoomImageSerializer(image_objs, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hostel, Room
from .serializers import HostelSerializer, RoomSerializer, RoomDetailSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .choices import HOSTEL_FACILITIES
from rest_framework.generics import RetrieveAPIView

from rest_framework import generics, permissions
from .models import Hostel, Room
from .serializers import HostelSerializer, RoomSerializer


# -----------------------------
# Facility List API (for checkboxes)
# -----------------------------
class HostelFacilityListView(APIView):
    def get(self, request):
        return Response(HOSTEL_FACILITIES, status=status.HTTP_200_OK)


# -----------------------------
# Hostel CRUD
# -----------------------------
class HostelCreateView(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "owner":
            raise PermissionDenied("Only owners can create hostels.")
        serializer.save(owner=user)


class MyHostelsView(APIView):
    """Return all hostels owned by the signed-in owner"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "owner":
            return Response(
                {"error": "Only owners can view their hostels."},
                status=status.HTTP_403_FORBIDDEN,
            )

        hostels = Hostel.objects.filter(owner=user)
        serializer = HostelSerializer(hostels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HostelDeleteView(APIView):
    """
    Delete a hostel owned by the logged-in owner
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        if user.role != "owner":
            return Response(
                {"error": "Only owners can delete hostels."},
                status=status.HTTP_403_FORBIDDEN
            )

        hostel = get_object_or_404(Hostel, pk=pk, owner=user)
        hostel.delete()
        return Response(
            {"message": "Hostel deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ---------------------------
# Create Room Listing
# ---------------------------

class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        hostel_id = request.data.get("hostel")

        if user.role != "owner":
            raise PermissionDenied("Only owners can create room listings.")

        try:
            hostel = Hostel.objects.get(id=hostel_id, owner=user)
        except Hostel.DoesNotExist:
            raise PermissionDenied("You can only add rooms to your own hostels.")

        serializer = RoomSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(hostel=hostel)  # ✅ Explicitly attach the correct hostel
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# View My Room Listings
# ---------------------------
class MyRoomsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "owner":
            return Response(
                {"error": "Only owners can view their listings."},
                status=status.HTTP_403_FORBIDDEN
            )

        rooms = Room.objects.filter(hostel__owner=user)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RoomAvailabilityUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        user = request.user

        if user.role != "owner":
            return Response(
                {"error": "Only owners can update room availability."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            room = Room.objects.get(pk=pk, hostel__owner=user)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found or not your room."},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("is_available")
        if new_status is None:
            return Response(
                {"error": "Please provide is_available field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        room.is_available = bool(new_status)
        room.save()

        return Response({"message": f"Room availability updated to {room.is_available}"})


class RoomDeleteView(APIView):
    """
    Delete a room owned by the logged-in owner
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        if user.role != "owner":
            return Response(
                {"error": "Only owners can delete rooms."},
                status=status.HTTP_403_FORBIDDEN
            )

        room = get_object_or_404(Room, pk=pk, hostel__owner=user)
        room.delete()
        return Response(
            {"message": "Room deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ---------------------------
# Update Hostel
# ---------------------------
class HostelUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = request.user
        if user.role != "owner":
            return Response(
                {"error": "Only owners can update hostels."},
                status=status.HTTP_403_FORBIDDEN
            )

        hostel = get_object_or_404(Hostel, pk=pk, owner=user)
        serializer = HostelSerializer(hostel, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# Update Room
# ---------------------------
class RoomUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = request.user
        if user.role != "owner":
            return Response(
                {"error": "Only owners can update rooms."},
                status=status.HTTP_403_FORBIDDEN
            )

        room = get_object_or_404(Room, pk=pk, hostel__owner=user)
        serializer = RoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomDetailView(RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role != "owner":
            raise PermissionDenied("Only owners can view room details.")

        return get_object_or_404(Room, pk=self.kwargs["pk"], hostel__owner=user)



# ---- Edit Hostel ----
class HostelUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optional: Only allow owner to edit their own hostel
        user = self.request.user
        return Hostel.objects.filter(owner=user)


# ---- Edit Room ----
class RoomUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow editing rooms of hostels owned by this user
        user = self.request.user
        return Room.objects.filter(hostel__owner=user)
