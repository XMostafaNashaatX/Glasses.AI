from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "first_name",
            "middle_name",
            "last_name",
            "phone_number",
            "gender",
            "profile_image",
        ]
        extra_kwargs = {
            "first_name": {"required": False},
            "middle_name": {"required": False},
            "last_name": {"required": False},
            "phone_number": {"required": False},
            "gender": {"required": False},
            "profile_image": {"required": False},
        }


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)  # Make profile optional

    class Meta:
        model = User
        fields = ("username", "password", "email", "profile")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        # Extract profile data if provided
        profile_data = validated_data.pop("profile", None)
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Create and associate the profile if profile data is provided
        if profile_data:
            Profile.objects.create(user=user, **profile_data)

        return user


class UserSignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value
