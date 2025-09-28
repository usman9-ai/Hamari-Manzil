from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.urls import reverse
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

User = get_user_model()


# ------------------------------
# Helper function to send verification email
# ------------------------------
def send_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    verification_link = request.build_absolute_uri(
        reverse("verify-email", kwargs={"uidb64": uid, "token": token})
    )

    subject = "Verify your email"
    message = (
        f"Hi {user.username},\n\n"
        f"Please click the link below to verify your email address. "
        f"You will be automatically logged in after verification:\n\n"
        f"{verification_link}\n\n"
        f"If you did not create this account, please ignore this email."
    )

    send_mail(
        subject,
        message,
        None,  # will use DEFAULT_FROM_EMAIL from settings.py
        [user.email],
        fail_silently=False,
    )


# ------------------------------
# Email Verification View
# ------------------------------
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.html import mark_safe

def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        html_content = """
        <html>
        <head>
            <title>Email Verification Failed</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; text-align: center; }
                .container { max-width: 600px; margin: 50px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .error { color: #dc3545; }
                .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error">Verification Failed</h1>
                <p>Sorry, this verification link is invalid or has expired.</p>
                <a href="http://localhost:8000/api/users/login/" class="button">Go to Login</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)

    if user is not None and default_token_generator.check_token(user, token):
        was_active = user.is_active
        user.is_active = True
        user.save()

        if was_active:
            message = "Your email was already verified. You can now log in."
        else:
            message = "Your email has been successfully verified! You can now log in."

        html_content = f"""
        <html>
        <head>
            <title>Email Verification Success</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; text-align: center; }}
                .container {{ max-width: 600px; margin: 50px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
                .success {{ color: #28a745; }}
                .button {{ display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="success">Email Verified!</h1>
                <p>{message}</p>
                <p>You can now use your email and password to sign in.</p>
                <a href="http://localhost:8000/api/users/login/" class="button">Go to Login</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)
    else:
        html_content = """
        <html>
        <head>
            <title>Email Verification Failed</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; text-align: center; }
                .container { max-width: 600px; margin: 50px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .error { color: #dc3545; }
                .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error">Verification Failed</h1>
                <p>Sorry, this verification link is invalid or has expired.</p>
                <a href="http://localhost:8000/api/users/login/" class="button">Go to Login</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)


# ------------------------------
# Registration View
# ------------------------------
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.is_active = False  # Require email verification before login
        user.save()

        send_verification_email(user, self.request)


# ------------------------------
# Profile View (only for logged-in users)
# ------------------------------
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user



# JWT Login via email
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        # Convert username to email if username was sent instead
        if 'username' in request.data and 'email' not in request.data:
            request.data['email'] = request.data['username']
            
        return super().post(request, *args, **kwargs)