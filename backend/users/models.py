from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import RegexValidator
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    # Roles
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('owner', 'Hostel Owner')
    )

    # Genders
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )

    is_active = models.BooleanField(default=False)
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    username = models.CharField(max_length=150, unique=True, blank=False, null=False)
    # Custom fields
    profile_picture = CloudinaryField('image', null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='male', blank=False, null=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student',  blank=False, null=False)
    phone_regex = RegexValidator(
        regex=r'^(\+92|0)?3\d{9}$',
        message="Phone number must be a valid Pakistani number. Format: +923XXXXXXXXX or 03XXXXXXXXX"
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=13,
        blank=False,
        null=False,
        help_text="Pakistani mobile number starting with +923 or 03"
    )
    city = models.CharField(max_length=50,  blank=False, null=False)
    verification_status = models.BooleanField(default=False)

    # Override inherited ManyToManyFields to avoid reverse accessor conflicts
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",
        blank=True,
        help_text="The groups this user belongs to."
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",
        blank=True,
        help_text="Specific permissions for this user."
    )


    USERNAME_FIELD = 'email'  # use email to login
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'gender', 'role', 'phone', 'city']  # Fields required when creating a superuser

    def __str__(self):
        return self.username
