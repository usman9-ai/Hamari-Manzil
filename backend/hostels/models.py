from django.db import models
from users.models import User
from cloudinary.models import CloudinaryField

GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )

ROOM_TYPE_CHOICES = (
        ('shared', 'Shared Room'),
        ('ind', 'Independent Room')
    )


CITY_CHOICES = [
    ("karachi", "Karachi"),
    ("lahore", "Lahore"),
    ("islamabad", "Islamabad"),
    ("multan", "Multan"),
    ('bahawalpur', "Bahawalpur"),
    ('rawalpindi', "Rawalpindi"),
    ("faisalabad", "Faisalabad"),
    ("peshawar", "Peshawar"),
    ("quetta", "Quetta"),
    # ... add more major cities
]

class Hostel(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'owner'})
    name = models.CharField(max_length=100, blank=False, null=False)
    media = CloudinaryField('image', blank=True, null=True) 
    city = models.CharField(max_length=10, choices= CITY_CHOICES, default='lahore', blank=False, null=False)
    longitude = models.FloatField(blank=False, null=False)
    latitude = models.FloatField(blank=False, null=False)
    map_location = models.TextField(blank=True, null=True)  # Google Maps URL
    gender = models.CharField(max_length=10, choices= GENDER_CHOICES, default='male', blank=False, null=False)
    total_rooms = models.IntegerField( blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    verification_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Room(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE,  related_name="rooms")
    media = CloudinaryField('image', blank=True, null=True)   # Optional: main image
    room_type = models.CharField(max_length=50, choices= ROOM_TYPE_CHOICES, default='shared', blank=False, null=False)
    total_capacity = models.PositiveIntegerField(help_text="Total number of beds in the room")
    available_capacity = models.PositiveIntegerField(help_text="Number of beds currently available")
    rent = models.DecimalField(max_digits=10, decimal_places=2, help_text="Monthly rent per bed")
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    facilities = models.JSONField(blank=True, null=True, help_text="List of available facilities")
    description = models.TextField(blank=True, null=True)
    is_available = models.BooleanField(default=True)  
    verification_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# List of allowed facilities
ALLOWED_FACILITIES = [
    'wifi', 'ac', 'heater', 'tv', 'laundry', 
    'kitchen', 'parking', 'security_cameras',
    'study_table', 'cupboard', 'ups', 'geyser'
]

# New model for multiple images per room
class RoomImage(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="images")
    image = CloudinaryField('image', blank=False, null=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
