from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model, authenticate
from users.backends import EmailBackend

User = get_user_model()

class Command(BaseCommand):
    help = 'Debug authentication issues'

    def handle(self, *args, **kwargs):
        # List all users
        self.stdout.write("\nAll users in database:")
        for user in User.objects.all():
            self.stdout.write(f"\nEmail: {user.email}")
            self.stdout.write(f"Username: {user.username}")
            self.stdout.write(f"Is active: {user.is_active}")
            self.stdout.write(f"Has usable password: {user.has_usable_password()}")
            self.stdout.write("-" * 50)

        # Test authentication
        email = input("\nEnter email to test: ")
        password = input("Enter password to test: ")
        
        # Try direct user lookup
        try:
            user = User.objects.get(email=email)
            self.stdout.write("\nUser found in database:")
            self.stdout.write(f"Email: {user.email}")
            self.stdout.write(f"Username: {user.username}")
            self.stdout.write(f"Is active: {user.is_active}")
            self.stdout.write(f"Password hash: {user.password[:20]}...")
        except User.DoesNotExist:
            self.stdout.write("\nNo user found with this email")
            return

        # Try authentication with EmailBackend
        backend = EmailBackend()
        auth_user = backend.authenticate(None, username=email, password=password)
        if auth_user:
            self.stdout.write(self.style.SUCCESS("\nAuthentication successful with EmailBackend!"))
        else:
            self.stdout.write(self.style.ERROR("\nAuthentication failed with EmailBackend!"))
            # Test password directly
            if user.check_password(password):
                self.stdout.write(self.style.SUCCESS("Password is correct (direct check)"))
            else:
                self.stdout.write(self.style.ERROR("Password is incorrect (direct check)"))