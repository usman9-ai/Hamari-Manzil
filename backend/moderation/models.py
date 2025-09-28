from django.db import models
from users.models import User
from hostels.models import Hostel

class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class VerificationRequest(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'owner'})
    status = models.CharField(max_length=20, choices=(('pending','Pending'),('approved','Approved'),('rejected','Rejected')))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)