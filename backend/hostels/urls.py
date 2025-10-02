from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import * 

router = DefaultRouter()
router.register(r'create-hostels',HostelCreateView)

urlpatterns = [
    path('', include(router.urls)),
    path("hostel-facilities/", HostelFacilityListView.as_view(), name="hostel-facility-list"),
    path("my-hostels/", MyHostelsView.as_view(), name="my-hostels"),
    path("delete-hostel/<int:pk>/", HostelDeleteView.as_view(), name="delete-hostel"),
    path("create-room/", CreateRoomView.as_view(), name="create-room"),
    path("my-rooms/", MyRoomsView.as_view(), name="my-rooms"),
    path("rooms/<int:pk>/", RoomDetailView.as_view(), name="room-detail"),
    path("rooms/<int:pk>/availability/", RoomAvailabilityUpdateView.as_view(), name="room-availability"),
    path("delete-room/<int:pk>/", RoomDeleteView.as_view(), name="delete-hostel"),



]
