from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField
from users.models import User
from hostels.models import Hostel, Room

class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class VerificationRequest(models.Model):
    TYPE_CHOICES = (
        ('user', 'User Verification'),
        ('hostel', 'Hostel Verification'),
        ('room', 'Room Verification')
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    # Basic Fields
    request_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=None)
        
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    admin_notes = models.TextField(blank=True)

    # Relations
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role':'owner'},
        related_name='verification_requests'
    )
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)
    reviewed_by = models.ForeignKey(
        User, 
        null=True, 
        blank=True,
        related_name='reviewed_requests',
        on_delete=models.SET_NULL,
        limit_choices_to={'is_staff': True}
    )

    # User Verification Fields
    whatsapp_number = models.CharField(max_length=15, null=True, blank=True)
    whatsapp_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    profile_image = CloudinaryField('profile', null=True, blank=True)
    cnic_front = CloudinaryField('cnic_front', null=True, blank=True, help_text="Front side of CNIC")
    cnic_back = CloudinaryField('cnic_back', null=True, blank=True, help_text="Back side of CNIC")
    passport_photo = CloudinaryField('passport_photo', null=True, blank=True, help_text="Passport-size photo captured by camera")

    # Hostel Verification Fields
    hostel_thumbnail = CloudinaryField('thumbnail', null=True, blank=True)
    utility_bill = CloudinaryField('utility_bill', null=True, blank=True, help_text="Utility bill or property document for location verification")
    location_lat = models.FloatField(null=True, blank=True)
    location_lng = models.FloatField(null=True, blank=True)
    location_verified = models.BooleanField(default=False)

    # Room Verification Fields
    room_images = models.JSONField(null=True, blank=True, help_text="List of {url, source, verified} objects where source is 'camera' or 'gallery'")
    
    # Admin Feedback
    rejection_reason = models.TextField(blank=True, null=True, help_text="Detailed reason for rejection provided by admin")

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.request_type} verification for {self.user.username}"

    def generate_whatsapp_otp(self):
        """Generate 6-digit OTP for WhatsApp verification"""
        from random import randint
        self.otp = str(randint(100000, 999999))
        self.otp_created_at = timezone.now()
        self.save()
        return f"https://wa.me/{self.whatsapp_number}?text=Your Hostel Finder verification code is: {self.otp}"

    def verify_otp(self, input_otp):
        """Verify WhatsApp OTP"""
        if not self.otp or not self.otp_created_at:
            return False
        
        # Check if OTP is expired (10 minutes)
        if (timezone.now() - self.otp_created_at).total_seconds() > 600:
            return False
        
        if self.otp == input_otp:
            self.whatsapp_verified = True
            self.save()
            return True
        return False

    def approve(self, admin_user, notes=''):
        """Approve verification request"""
        self.status = 'approved'
        self.reviewed_by = admin_user
        self.admin_notes = notes
        self.save()

        # Update related model verification status
        if self.request_type == 'user':
            self.user.verification_status = True
            self.user.save()
        elif self.request_type == 'hostel':
            self.hostel.is_verified = True
            self.hostel.save()
        elif self.request_type == 'room':
            self.room.is_verified = True
            self.room.save()

    def reject(self, admin_user, notes):
        """Reject verification request"""
        self.status = 'rejected'
        self.reviewed_by = admin_user
        self.admin_notes = notes
        self.save()