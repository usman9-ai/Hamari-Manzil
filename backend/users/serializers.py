from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from hostels.models import Hostel


User = get_user_model()

# ==========================
# JWT Serializer for email login
# ==========================
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields['password'] = serializers.CharField(style={'input_type': 'password'})
        # Remove username field as we're using email
        self.fields.pop('username', None)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('Must provide both email and password.')

        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email address.')

        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect password.')

        if not user.is_active:
            raise serializers.ValidationError('This account is not active.')

        # Add the username field that the parent class expects
        attrs['username'] = user.email
        
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        token['email'] = user.email
        token['username'] = user.username
        return token


# ==========================
# Registration Serializer
# ==========================
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'username', 'email',
            'password', 'password2', 'gender', 'role', 'phone', 'city'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


# ==========================
# Simple User Serializer (for profile)
# ==========================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', 'groups', 'user_permissions')


# ==========================
# Hostel Serializer
# ==========================
class HostelSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Hostel
        fields = ['id', 'name', 'description', 'location', 'latitude', 'longitude']

    def get_latitude(self, obj):
        try:
            lat, lng = map(float, obj.location.split(","))
            return lat
        except Exception:
            return None

    def get_longitude(self, obj):
        try:
            lat, lng = map(float, obj.location.split(","))
            return lng
        except Exception:
            return None

    def create(self, validated_data):
        # if latitude & longitude provided separately, build location
        lat = self.initial_data.get("latitude")
        lng = self.initial_data.get("longitude")
        if lat and lng:
            validated_data["location"] = f"{lat},{lng}"
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # allow update with latitude & longitude separately
        lat = self.initial_data.get("latitude")
        lng = self.initial_data.get("longitude")
        if lat and lng:
            validated_data["location"] = f"{lat},{lng}"
        return super().update(instance, validated_data)
