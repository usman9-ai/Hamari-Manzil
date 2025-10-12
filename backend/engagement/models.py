from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg, Count, F, Sum
from django.utils import timezone
from datetime import timedelta
from users.models import User
from hostels.models import Hostel, Room

# ----------------- Search History -----------------
class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    latitude = models.FloatField(
        validators=[
            MinValueValidator(-90.0, message="Latitude must be between -90 and 90 degrees"),
            MaxValueValidator(90.0, message="Latitude must be between -90 and 90 degrees")
        ]
    )
    longitude = models.FloatField(
        validators=[
            MinValueValidator(-180.0, message="Longitude must be between -180 and 180 degrees"),
            MaxValueValidator(180.0, message="Longitude must be between -180 and 180 degrees")
        ]
    )
    radius = models.IntegerField(  # in kilometers
        validators=[
            MinValueValidator(1, message="Search radius must be at least 1 kilometer"),
            MaxValueValidator(50, message="Search radius cannot exceed 50 kilometers")
        ]
    )
    gender_preference = models.CharField(
        max_length=10,
        null=True,
        blank=True,
        choices=[('male', 'Male'), ('female', 'Female')]
    )
    min_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.0, message="Minimum price cannot be negative")]
    )
    max_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0.0, message="Maximum price cannot be negative")]
    )
    facilities = models.JSONField(null=True, blank=True)  # Store selected facilities
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.created_at}"

# ----------------- Reviews -----------------
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5"
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hostel')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} -> {self.hostel} ({self.rating})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update hostel's average rating
        avg_rating = Review.objects.filter(hostel=self.hostel).aggregate(Avg('rating'))['rating__avg']
        self.hostel.average_rating = avg_rating
        self.hostel.save()

# ----------------- Favorites -----------------
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hostel')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} ♥ {self.hostel}"

# ----------------- Interaction Logs -----------------
class InteractionLog(models.Model):
    INTERACTION_TYPES = (
        ('view', 'Viewed Hostel'),
        ('whatsapp', 'WhatsApp Contact'),
        ('call', 'Phone Call'),
        ('search', 'Search Result Click')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    search_query = models.ForeignKey(SearchHistory, on_delete=models.SET_NULL, null=True, blank=True)
    safety_confirmed = models.BooleanField(
        default=False,
        help_text="Whether the user confirmed the safety modal (required for female users)"
    )
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} {self.interaction_type} {self.hostel}"
        

# ----------------- Analytics -----------------
class HostelAnalytics(models.Model):
    hostel = models.OneToOneField(Hostel, on_delete=models.CASCADE, related_name='analytics')
    total_views = models.IntegerField(default=0)
    total_contacts = models.IntegerField(default=0)  # whatsapp + calls
    total_favorites = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analytics for {self.hostel}"

    @classmethod
    def increment_view(cls, hostel_id):
        """Increment view count for a hostel"""
        analytics, _ = cls.objects.get_or_create(hostel_id=hostel_id)
        analytics.total_views = F('total_views') + 1
        analytics.save()

    @classmethod
    def increment_contact(cls, hostel_id):
        """Increment contact count for a hostel"""
        analytics, _ = cls.objects.get_or_create(hostel_id=hostel_id)
        analytics.total_contacts = F('total_contacts') + 1
        analytics.save()

    @classmethod
    def update_favorites(cls, hostel_id):
        """Update favorites count for a hostel"""
        analytics, _ = cls.objects.get_or_create(hostel_id=hostel_id)
        analytics.total_favorites = Favorite.objects.filter(hostel_id=hostel_id).count()
        analytics.save()


class DailyAnalytics(models.Model):
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='daily_analytics')
    date = models.DateField()
    views = models.IntegerField(default=0)
    contacts = models.IntegerField(default=0)
    favorites = models.IntegerField(default=0)
    searches_appeared = models.IntegerField(default=0)  # Number of times shown in search results
    
    class Meta:
        unique_together = ('hostel', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"Daily Analytics for {self.hostel} on {self.date}"

    @classmethod
    def log_view(cls, hostel_id):
        """Log a view for today"""
        today = timezone.now().date()
        analytics, _ = cls.objects.get_or_create(
            hostel_id=hostel_id,
            date=today,
            defaults={'views': 0}
        )
        analytics.views = F('views') + 1
        analytics.save()

    @classmethod
    def log_contact(cls, hostel_id):
        """Log a contact for today"""
        today = timezone.now().date()
        analytics, _ = cls.objects.get_or_create(
            hostel_id=hostel_id,
            date=today,
            defaults={'contacts': 0}
        )
        analytics.contacts = F('contacts') + 1
        analytics.save()

    @classmethod
    def log_search_appearance(cls, hostel_id):
        """Log when hostel appears in search results"""
        today = timezone.now().date()
        analytics, _ = cls.objects.get_or_create(
            hostel_id=hostel_id,
            date=today,
            defaults={'searches_appeared': 0}
        )
        analytics.searches_appeared = F('searches_appeared') + 1
        analytics.save()


# ----------------- Reports -----------------
class Report(models.Model):
    REPORT_REASONS = [
        ('fake', 'Fake Listing'),
        ('inappropriate', 'Inappropriate Content'),
        ('spam', 'Spam'),
        ('fraud', 'Fraud Attempt'),
        ('incorrect_info', 'Incorrect Information'),
        ('safety', 'Safety Concern'),
        ('other', 'Other')
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'student'},
        related_name='engagement_reports'  # Changed to be app-specific
    )
    hostel = models.ForeignKey(
        Hostel, 
        on_delete=models.CASCADE, 
        related_name='engagement_reports'  # Changed to be app-specific
    )
    reason = models.CharField(max_length=20, choices=REPORT_REASONS)
    details = models.TextField(help_text="Additional details about the report")
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending Review'),
            ('investigating', 'Under Investigation'),
            ('resolved', 'Resolved'),
            ('dismissed', 'Dismissed')
        ],
        default='pending'
    )
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report by {self.user} for {self.hostel} - {self.reason}"


class AnalyticsSummary(models.Model):
    """Weekly/Monthly analytics summaries for faster retrieval"""
    PERIOD_CHOICES = [
        ('W', 'Weekly'),
        ('M', 'Monthly'),
    ]
    
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='analytics_summaries')
    period_type = models.CharField(max_length=1, choices=PERIOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    total_views = models.IntegerField(default=0)
    total_contacts = models.IntegerField(default=0)
    total_favorites = models.IntegerField(default=0)
    total_searches = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0)  # contacts/views * 100
    
    class Meta:
        unique_together = ('hostel', 'period_type', 'start_date')
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.get_period_type_display()} Summary for {self.hostel} ({self.start_date})"

    @classmethod
    def generate_summary(cls, hostel_id, period_type, start_date):
        """Generate analytics summary for a given period"""
        if period_type == 'W':
            end_date = start_date + timedelta(days=6)
        else:  # Monthly
            next_month = start_date.replace(day=28) + timedelta(days=4)
            end_date = next_month - timedelta(days=next_month.day)
        
        # Aggregate daily analytics
        daily_data = DailyAnalytics.objects.filter(
            hostel_id=hostel_id,
            date__range=[start_date, end_date]
        ).aggregate(
            total_views=Sum('views'),
            total_contacts=Sum('contacts'),
            total_favorites=Sum('favorites'),
            total_searches=Sum('searches_appeared')
        )
        
        # Calculate conversion rate
        views = daily_data['total_views'] or 0
        contacts = daily_data['total_contacts'] or 0
        conversion_rate = (contacts / views * 100) if views > 0 else 0
        
        # Create or update summary
        summary, _ = cls.objects.update_or_create(
            hostel_id=hostel_id,
            period_type=period_type,
            start_date=start_date,
            defaults={
                'end_date': end_date,
                'total_views': daily_data['total_views'] or 0,
                'total_contacts': daily_data['total_contacts'] or 0,
                'total_favorites': daily_data['total_favorites'] or 0,
                'total_searches': daily_data['total_searches'] or 0,
                'conversion_rate': conversion_rate
            }
        )
        return summary


# This section was removed as it was duplicated
