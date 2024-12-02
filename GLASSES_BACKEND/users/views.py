from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from .serializer import UserSerializer, UserSignupSerializer
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializer import UserSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import ValidationError


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            csrf_token = get_token(request)

            if user.is_staff:

                return Response(
                    {
                        "message": "Login successful",
                        "csrf_token": csrf_token,
                        "redirect_to": "/admin_dashboard/",
                    },
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(
                    {
                        "message": "Login successful",
                        "csrf_token": csrf_token,
                        "redirect_to": "/user_dashboard/",
                    },
                    status=status.HTTP_200_OK,
                )

        else:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


def csrf(request):

    try:
        csrf_token = get_token(request)
        return JsonResponse({"csrf_token": csrf_token})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def signup(request):
    if request.method == "POST":
        # Use the serializer to validate the data
        serializer = UserSignupSerializer(data=request.data)

        # Check if the serializer is valid
        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")

            try:
                # Create new user
                user = User.objects.create_user(
                    username=username, email=email, password=password
                )

                return Response(
                    {"message": "User created successfully"},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": "Internal server error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        print(serializer.errors)
        # If the serializer is not valid, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve user and profile information"""
        user = request.user
        # Ensure profile data is included (could be in a separate Profile model)
        profile = Profile.objects.get(user=user)
        # Assuming Profile model has image and other fields
        profile_data = {
            "username": user.username,
            "first_name": user.first_name,
            "middle_name": profile.middle_name if profile.middle_name else "",
            "last_name": user.last_name,
            "email": user.email,
            "profile_image": profile.profile_image.url if profile.profile_image else "",
        }
        return Response(profile_data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update user and profile information"""
        user = request.user
        # Check if profile exists for the user
        profile = Profile.objects.get(user=user)

        # Combine user and profile data to update
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        profile_serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if user_serializer.is_valid() and profile_serializer.is_valid():
            # Save updated user and profile
            user_serializer.save()
            profile_serializer.save()
            return Response(
                {"message": "Profile updated successfully"}, status=status.HTTP_200_OK
            )

        return Response(
            {
                "user_errors": user_serializer.errors,
                "profile_errors": profile_serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@login_required
def user_profile(request):
    """Function-based view to get user profile"""
    user = request.user

    # If user has a profile, fetch additional info
    profile = Profile.objects.get(user=user)
    profile_data = {
        "username": user.username,
        "first_name": user.first_name,
        "middle_name": profile.middle_name if profile.middle_name else "",
        "last_name": user.last_name,
        "email": user.email,
        "profile_image": profile.profile_image.url if profile.profile_image else "",
    }

    return JsonResponse(profile_data)
