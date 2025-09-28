from django.db import models
from users.models import User


GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )

class Hostel(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'owner'})
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    area = models.CharField(max_length=50)
    map_location = models.URLField(blank=True)
    gender = models.CharField(max_length=10, choices= GENDER_CHOICES, default='male')
    media = models.JSONField(blank=True, null=True)  # To store images/videos as a list of URLs
    facilities = models.JSONField(blank=True, null=True)  # To store facilities as a list of 
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Room(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    capacity = models.IntegerField()
    beds_available = models.IntegerField()
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    facilities = models.JSONField(blank=True, null=True)  # To store room facilities as a list of strings
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
