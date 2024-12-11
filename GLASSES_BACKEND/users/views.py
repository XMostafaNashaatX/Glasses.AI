from django.shortcuts import render
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
