from django.db import models
from users.models import User


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
    city = models.CharField(max_length=50, choices=CITY_CHOICES, blank=False, null=False)


class Hostel(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'owner'})
    name = models.CharField(max_length=100, blank=False, null=False)
    city = models.CharField(max_length=10, choices= CITY_CHOICES, default='lahore', blank=False, null=False)
    longitude = models.FloatField(blank=False, null=False)
    latitude = models.FloatField(blank=False, null=False)
    map_location = models.TextField(blank=True, null=True)  # Google Maps URL
    gender = models.CharField(max_length=10, choices= GENDER_CHOICES, default='male', blank=False, null=False)
    total_rooms = models.IntegerField( blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Room(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE,  related_name="rooms")
    media  = models.JSONField(blank=True, null=True)  # To store images/videos as a list of URLs
    room_type = models.CharField(max_length=50, choices= ROOM_TYPE_CHOICES, default='shared', blank=False, null=False)
    total_capacity = models.IntegerField()
    available_capacity = models.IntegerField()
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    facilities = models.JSONField(blank=True, null=True)  # To store room facilities as a list of strings
    description = models.TextField(blank=True, null=True)
    is_available = models.BooleanField(default=True)  
    created_at = models.DateTimeField(auto_now_add=True)
