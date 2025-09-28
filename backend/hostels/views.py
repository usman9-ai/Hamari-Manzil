# Create your views here.
from rest_framework import viewsets
from .models import Hostel, Room
from .serializers import HostelSerializer, RoomSerializer

class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
