from django.db import models
from users.models import User
from hostels.models import Hostel

# ----------------- Reviews -----------------
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hostel')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} -> {self.hostel} ({self.rating})"


# ----------------- Favorites -----------------
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hostel')

    def __str__(self):
        return f"{self.user} favorites {self.hostel}"


# ----------------- Interaction Log -----------------
class InteractionLog(models.Model):
    INTERACTION_CHOICES = [
        ('view', 'View'),
        ('call', 'Call'),
        ('whatsapp', 'WhatsApp'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_CHOICES, default='view')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.interaction_type} -> {self.hostel}"
