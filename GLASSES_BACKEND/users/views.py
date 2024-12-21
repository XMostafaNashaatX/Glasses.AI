from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
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
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from users.models import Profile
from users.serializer import ProfileSerializer


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
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "message": "Login successful",
                    "access_token": access_token,
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
        serializer = UserSignupSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")
            confirm_password = serializer.validated_data.get(
                "confirm_password"
            )  # Get confirm_password

            # Ensure password and confirm_password match
            if password != confirm_password:
                return Response(
                    {"error": "Passwords do not match"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            first_name = serializer.validated_data.get("first_name", "")
            last_name = serializer.validated_data.get("last_name", "")
            middle_name = serializer.validated_data.get("middle_name", "")

            try:
                # Create new user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    password=password,
                )

                # Create the user's profile if necessary
                Profile.objects.create(
                    user=user,
                    first_name=first_name,
                    last_name=last_name,
                    middle_name=middle_name,
                )

                return Response(
                    {"message": f"User {username} created successfully"},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                # Return the error message
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        # If the serializer is not valid, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        View the profile information of the current logged-in user.
        """
        user = request.user
        try:
            profile = user.profile  # Attempt to get the user's profile
        except Profile.DoesNotExist:
            # Handle case where the profile doesn't exist
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Get profile image, use default if not available
        profile_image = (
            profile.profile_image
            if profile.profile_image
            else "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        )

        # Serialize the necessary profile data and user data
        profile_data = ProfileSerializer(profile).data
        user_data = {
            "username": user.username,
            "first_name": user.first_name,
            "middle_name": profile.middle_name,  # Assuming middle_name is in profile
            "last_name": user.last_name,
            "email": user.email,
            "profile_image": profile_image,  # Ensure the profile image is included
        }

        return Response(user_data)


from django.contrib.auth import update_session_auth_hash


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """
        Update the profile information of the current logged-in user.
        """
        user = request.user
        try:
            profile = user.profile  # Attempt to get the user's profile
        except Profile.DoesNotExist:
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Update user data
        user_data = {
            "username": request.data.get("username", user.username),
            "email": request.data.get("email", user.email),
        }

        password = request.data.get("password", None)
        if password:
            try:
                validate_password(password, user=user)
                user.set_password(password)
            except ValidationError as e:
                return Response(
                    {"error": e.messages}, status=status.HTTP_400_BAD_REQUEST
                )

        user_serializer = UserSerializer(user, data=user_data, partial=True)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_serializer.save()

        # Update profile data
        profile_data = {
            "first_name": request.data.get("first_name", profile.first_name),
            "middle_name": request.data.get("middle_name", profile.middle_name),
            "last_name": request.data.get("last_name", profile.last_name),
        }

        # Handle profile image upload
        profile_picture = request.FILES.get("profile_picture", None)
        if profile_picture:
            profile_data["profile_image"] = profile_picture

        profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
        if not profile_serializer.is_valid():
            return Response(
                profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        profile_serializer.save()

        # Update session if password was changed
        if password:
            update_session_auth_hash(request, user)

        return Response({"message": "Profile updated successfully"})
