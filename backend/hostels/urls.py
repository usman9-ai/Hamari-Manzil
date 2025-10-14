from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HostelFacilityListView, RoomFacilityListView, MyHostelsView, HostelCreateView, 
    HostelDeleteView, CreateRoomView, MyRoomsView, 
    RoomAvailabilityUpdateView, RoomDeleteView,
    RoomImageUploadView, HostelUpdateView, RoomUpdateView
)

router = DefaultRouter()
router.register(r'create-hostels', HostelCreateView, basename='hostel')

urlpatterns = [
    path('', include(router.urls)),
    path("hostel-facilities/", HostelFacilityListView.as_view(), name="hostel-facility-list"),
    path("room-facilities/", RoomFacilityListView.as_view(), name="room-facility-list"),
    path("my-hostels/", MyHostelsView.as_view(), name="my-hostels"),
    path("delete-hostel/<int:pk>/", HostelDeleteView.as_view(), name="delete-hostel"),
    path("create-room/", CreateRoomView.as_view(), name="create-room"),
    path("my-rooms/", MyRoomsView.as_view(), name="my-rooms"),
    path("rooms/<int:pk>/availability/", RoomAvailabilityUpdateView.as_view(), name="room-availability"),
    path("delete-room/<int:pk>/", RoomDeleteView.as_view(), name="delete-hostel"),
    path('hostels/<int:pk>/edit/', HostelUpdateView.as_view(), name='hostel-edit'),
    path('rooms/<int:pk>/edit/', RoomUpdateView.as_view(), name='room-edit'),

path("edit-hostel/<int:pk>/", HostelUpdateView.as_view(), name="edit-hostel"),
path("rooms/<int:pk>/edit/", RoomUpdateView.as_view(), name="edit-room"),
    
    path("rooms/<int:room_id>/upload-images/", RoomImageUploadView.as_view(), name='room-upload-images'),


]
