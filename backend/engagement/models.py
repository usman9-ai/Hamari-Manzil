from django.db import models
from users.models import User
from hostels.models import Hostel

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class InteractionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=20, default='view')
    created_at = models.DateTimeField(auto_now_add=True)
