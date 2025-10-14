from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.urls import reverse
from django.http import HttpResponse
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserRegistrationSerializer, UserProfileSerializer,
    ChangePasswordSerializer, ResetPasswordEmailSerializer,
    ResetPasswordConfirmSerializer, MyTokenObtainPairSerializer
)
import cloudinary.uploader

User = get_user_model()

# ============================================================
# Email Verification Helper
# ============================================================
def send_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # Use frontend URL so user gets a nice React page
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

    subject = "Verify your email - Hamari Manzil"
    message = (
        f"Hi {user.username},\n\n"
        f"Please click the link below to verify your email:\n{verification_link}\n\n"
        f"If you didn't create this account, please ignore this email."
    )

    send_mail(subject, message, None, [user.email], fail_silently=False)


# ============================================================
# Email Verification View
# ============================================================
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return HttpResponse("<h3>Invalid verification link.</h3>")

    if user and default_token_generator.check_token(user, token):
        if not user.is_active:
            user.is_active = True
            user.save()
            message = "Email verified successfully! You can now log in."
        else:
            message = "Email already verified."

        return HttpResponse(f"<h3>{message}</h3>")
    return HttpResponse("<h3>Invalid or expired verification link.</h3>")


# ============================================================
# User Registration
# ============================================================
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save(is_active=False)
            send_verification_email(user, request)
            
            return Response({
                "status": "success",
                "message": "Registration successful! Please check your email to verify your account.",
                "data": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                }
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            error_messages = {}
            
            # Handle field-specific errors
            if hasattr(e.detail, 'items'):
                for field, errors in e.detail.items():
                    if isinstance(errors, list):
                        error_messages[field] = errors[0]
                    else:
                        error_messages[field] = str(errors)
            else:
                error_messages["error"] = str(e)

            return Response({
                "status": "error",
                "message": "Registration failed.",
                "errors": error_messages
            }, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# User Profile View
# ============================================================
class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data.copy()
        
        try:
            # Handle profile picture upload first
            profile_picture = request.FILES.get("profile_picture")
            if profile_picture:
                try:
                    # Upload to Cloudinary
                    upload_result = cloudinary.uploader.upload(
                        profile_picture,
                        folder="profile_pictures",
                        transformation={
                            "width": 400,
                            "height": 400,
                            "crop": "fill"
                        }
                    )
                    # Save public_id to model field
                    data['profile_picture'] = upload_result['public_id']
                except Exception as e:
                    return Response(
                        {"error": f"Failed to upload profile picture: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Update the user data
            serializer = self.get_serializer(user, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": f"Failed to update profile: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False  # Soft delete
        user.save()
        return Response({"detail": "Account deactivated successfully."})


# ============================================================
# Change Password
# ============================================================
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.data.get("old_password")):
            return Response({"old_password": "Incorrect password."},
                            status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.data.get("new_password"))
        user.save()
        return Response({"message": "Password updated successfully."})


# ============================================================
# Password Reset - Request Email
# ============================================================
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = ResetPasswordEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If an account exists, reset email sent."})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Use frontend URL so user can reset password in React app
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        subject = "Reset your password - Hamari Manzil"
        message = f"Click below to reset your password:\n\n{reset_link}"
        send_mail(subject, message, None, [email], fail_silently=False)

        return Response({"message": "Password reset link sent successfully."})


# ============================================================
# Password Reset - Confirm
# ============================================================
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        serializer = ResetPasswordConfirmSerializer(data={**request.data, "token": token, "uidb64": uidb64})
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password reset successfully."})


# ============================================================
# JWT Login via Email
# ============================================================
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        if "username" in request.data and "email" not in request.data:
            request.data["email"] = request.data["username"]
        return super().post(request, *args, **kwargs)
