from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from .serializer import UserSerializer
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST


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
                    {"message": "Login successful", "csrf_token": csrf_token, "redirect_to": "/admin_dashboard/"},
                    status=status.HTTP_200_OK,
                )
            
            else:
                return Response(
                    {"message": "Login successful", "csrf_token": csrf_token, "redirect_to": "/user_dashboard/"},
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


class UserCreate(generics.CreateAPIView):
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
