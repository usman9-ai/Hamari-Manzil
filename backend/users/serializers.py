from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from hostels.models import Hostel, Room
import cloudinary.uploader

User = get_user_model()


# ======================================
# JWT Login (Email-based)
# ======================================
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields['password'] = serializers.CharField(style={'input_type': 'password'})
        self.fields.pop('username', None)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('Both email and password are required.')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email.')

        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect password.')

        if not user.is_active:
            raise serializers.ValidationError('This account is not active.')

        attrs['username'] = user.email  # required for parent logic
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role
        return token


# ======================================
# Registration Serializer
# ======================================
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'username', 'email',
            'password', 'password2', 'gender', 'role', 'phone', 'city'
        )

    def validate(self, attrs):
        # Password match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })

        # Required fields check
        required_fields = ['first_name', 'last_name', 'gender', 'role', 'phone', 'city']
        for field in required_fields:
            if not attrs.get(field):
                raise serializers.ValidationError({
                    field: f"{field.replace('_', ' ').title()} is required."
                })

        # Unique validations
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        if User.objects.filter(phone=attrs['phone']).exists():
            raise serializers.ValidationError({"phone": "A user with this phone number already exists."})
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})

        return attrs

    def create(self, validated_data):
        # Remove password2 as it's not needed for user creation
        validated_data.pop('password2')
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception:
            raise serializers.ValidationError({
                "error": "Failed to create user. Please try again."
            })


# ======================================
# Profile Serializer (with Cloudinary)
# ======================================
class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'gender', 'role', 'phone', 'city',
            'profile_picture', 'profile_picture_url',
            'date_joined', 'verification_status'
        )
        read_only_fields = ('id', 'email', 'date_joined', 'verification_status')

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            try:
                # CloudinaryField stores public_id, use cloudinary.utils to get URL
                from cloudinary.utils import cloudinary_url
                url, options = cloudinary_url(obj.profile_picture, format="jpg")
                return url
            except Exception:
                return None
        return None

    def update(self, instance, validated_data):
        upload_file = self.context['request'].FILES.get('profile_picture_upload', None)
        if upload_file:
            result = cloudinary.uploader.upload(
                upload_file,
                folder="hamari_manzil/profile_pictures",
                eager=[{"width": 300, "height": 300, "crop": "fill"}],
                overwrite=True
            )
            instance.profile_picture = result['public_id']

        for attr, value in validated_data.items():
            if attr != 'profile_picture_upload':
                setattr(instance, attr, value)
        instance.save()
        return instance


# ======================================
# Change Password Serializer
# ======================================
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "New passwords must match."})
        return attrs


# ======================================
# Reset Password Serializers
# ======================================
class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    uidb64 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs


# ======================================
# Hostel Serializer (with Cloudinary + lat/lng)
# ======================================
class HostelSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.username", read_only=True)
    media_upload = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    media_urls = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Hostel
        fields = [
            'id', 'name', 'description', 'city', 'latitude', 'longitude',
            'gender', 'total_rooms', 'media_upload', 'media_urls',
            'owner_name', 'verification_status', 'created_at'
        ]
        read_only_fields = ('owner_name', 'verification_status', 'created_at')

    def get_media_urls(self, obj):
        if not obj.media:
            return []
        return obj.media if isinstance(obj.media, list) else []

    def create(self, validated_data):
        media_files = self.context['request'].FILES.getlist('media_upload')
        uploaded_urls = []
        for file in media_files:
            result = cloudinary.uploader.upload(
                file, folder="hamari_manzil/hostels", eager=[{"width": 800, "height": 600, "crop": "fill"}]
            )
            uploaded_urls.append(result['secure_url'])
        validated_data['media'] = uploaded_urls
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        media_files = self.context['request'].FILES.getlist('media_upload')
        if media_files:
            uploaded_urls = []
            for file in media_files:
                result = cloudinary.uploader.upload(
                    file, folder="hamari_manzil/hostels", eager=[{"width": 800, "height": 600, "crop": "fill"}]
                )
                uploaded_urls.append(result['secure_url'])
            instance.media = uploaded_urls

        for attr, value in validated_data.items():
            if attr not in ['media_upload']:
                setattr(instance, attr, value)

        instance.save()
        return instance


# ======================================
# Room Serializer (with Cloudinary)
# ======================================
class RoomSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source="hostel.name", read_only=True)
    media_upload = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    media_urls = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'hostel', 'hostel_name', 'room_type',
            'total_capacity', 'available_capacity', 'rent',
            'security_deposit', 'facilities', 'description',
            'is_available', 'verification_status',
            'media_upload', 'media_urls', 'created_at'
        ]
        read_only_fields = ('verification_status', 'created_at')

    def get_media_urls(self, obj):
        if not obj.media:
            return []
        return obj.media if isinstance(obj.media, list) else []

    def create(self, validated_data):
        media_files = self.context['request'].FILES.getlist('media_upload')
        uploaded_urls = []
        for file in media_files:
            result = cloudinary.uploader.upload(
                file, folder="hamari_manzil/rooms", eager=[{"width": 800, "height": 600, "crop": "fill"}]
            )
            uploaded_urls.append(result['secure_url'])
        validated_data['media'] = uploaded_urls
        return super().create(validated_data)

    def update(self, instance, validated_data):
        media_files = self.context['request'].FILES.getlist('media_upload')
        if media_files:
            uploaded_urls = []
            for file in media_files:
                result = cloudinary.uploader.upload(
                    file, folder="hamari_manzil/rooms", eager=[{"width": 800, "height": 600, "crop": "fill"}]
                )
                uploaded_urls.append(result['secure_url'])
            instance.media = uploaded_urls

        for attr, value in validated_data.items():
            if attr not in ['media_upload']:
                setattr(instance, attr, value)

        instance.save()
        return instance
