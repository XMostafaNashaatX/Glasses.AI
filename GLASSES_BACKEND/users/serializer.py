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
            "profile_image",
        ]
        extra_kwargs = {
            "first_name": {"required": False},
            "middle_name": {"required": False},
            "last_name": {"required": False},
            "profile_image": {"required": False},
        }


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ("username", "email", "password", "profile")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        validate_password(value)
        return value

    def update(self, instance, validated_data):
        # Update user instance
        profile_data = validated_data.pop("profile", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile if profile data is provided
        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance


class UserSignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    middle_name = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def validate(self, data):
        # Check if password and confirm_password match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        # Remove confirm_password from validated data as it's not needed
        validated_data.pop("confirm_password", None)

        # Create the user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            password=validated_data["password"],
        )

        # Create profile with first_name, last_name, and middle_name
        Profile.objects.create(
            user=user,
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            middle_name=validated_data.get("middle_name", ""),
        )

        return user
