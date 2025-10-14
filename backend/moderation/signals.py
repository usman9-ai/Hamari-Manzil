from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from .models import VerificationRequest
from users.models import User
from hostels.models import Hostel, Room


@receiver(post_save, sender=User)
def invalidate_user_verification_on_profile_change(sender, instance, created, **kwargs):
    """
    Invalidate user verification when critical profile fields are changed
    """
    if created:
        return
    
    # Check if verification-related fields have changed
    verification_fields = ['first_name', 'last_name', 'phone', 'email', 'city']
    
    # Get the original instance from database to compare
    try:
        original = User.objects.get(pk=instance.pk)
    except User.DoesNotExist:
        return
    
    # Check if any verification-related fields have changed
    fields_changed = any(
        getattr(instance, field) != getattr(original, field) 
        for field in verification_fields
    )
    
    if fields_changed:
        # Invalidate all user verification requests
        with transaction.atomic():
            VerificationRequest.objects.filter(
                user=instance,
                request_type='user',
                status='approved'
            ).update(status='pending')
            
            # Reset user verification status
            instance.verification_status = False
            instance.save(update_fields=['verification_status'])


@receiver(post_save, sender=Hostel)
def invalidate_hostel_verification_on_change(sender, instance, created, **kwargs):
    """
    Invalidate hostel verification when critical hostel fields are changed
    """
    if created:
        return
    
    # Check if verification-related fields have changed
    verification_fields = ['name', 'city', 'latitude', 'longitude', 'map_location']
    
    # Get the original instance from database to compare
    try:
        original = Hostel.objects.get(pk=instance.pk)
    except Hostel.DoesNotExist:
        return
    
    # Check if any verification-related fields have changed
    fields_changed = any(
        getattr(instance, field) != getattr(original, field) 
        for field in verification_fields
    )
    
    if fields_changed:
        # Invalidate all hostel verification requests for this hostel
        with transaction.atomic():
            VerificationRequest.objects.filter(
                hostel=instance,
                request_type='hostel',
                status='approved'
            ).update(status='pending')
            
            # Reset hostel verification status
            instance.verification_status = False
            instance.save(update_fields=['verification_status'])


@receiver(post_save, sender=Room)
def invalidate_room_verification_on_change(sender, instance, created, **kwargs):
    """
    Invalidate room verification when critical room fields are changed
    """
    if created:
        return
    
    # Check if verification-related fields have changed
    verification_fields = ['room_type', 'total_capacity', 'available_capacity', 'rent', 'security_deposit', 'facilities', 'description']
    
    # Get the original instance from database to compare
    try:
        original = Room.objects.get(pk=instance.pk)
    except Room.DoesNotExist:
        return
    
    # Check if any verification-related fields have changed
    fields_changed = any(
        getattr(instance, field) != getattr(original, field) 
        for field in verification_fields
    )
    
    if fields_changed:
        # Invalidate all room verification requests for this room
        with transaction.atomic():
            VerificationRequest.objects.filter(
                room=instance,
                request_type='room',
                status='approved'
            ).update(status='pending')
            
            # Reset room verification status
            instance.verification_status = False
            instance.save(update_fields=['verification_status'])


@receiver(post_delete, sender=Room)
def invalidate_room_verification_on_delete(sender, instance, **kwargs):
    """
    Invalidate room verification when room is deleted
    """
    # Delete all verification requests for this room
    VerificationRequest.objects.filter(
        room=instance,
        request_type='room'
    ).delete()


@receiver(post_delete, sender=Hostel)
def invalidate_hostel_verification_on_delete(sender, instance, **kwargs):
    """
    Invalidate hostel verification when hostel is deleted
    """
    # Delete all verification requests for this hostel and its rooms
    VerificationRequest.objects.filter(
        hostel=instance
    ).delete()
