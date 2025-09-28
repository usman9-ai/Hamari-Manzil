from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'List all users in the database'

    def handle(self, *args, **kwargs):
        self.stdout.write("\nAll registered users:")
        self.stdout.write("-" * 50)
        
        users = User.objects.all()
        if not users:
            self.stdout.write(self.style.WARNING("No users found in the database!"))
            return
            
        for user in users:
            self.stdout.write(f"\nEmail: {user.email}")
            self.stdout.write(f"Username: {user.username}")
            self.stdout.write(f"Is active: {user.is_active}")
            self.stdout.write(f"Is staff: {user.is_staff}")
            self.stdout.write(f"Date joined: {user.date_joined}")
            self.stdout.write("-" * 50)