from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Login_user, Register
from .serializers import *
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken



def generate_tokens_for_user(user):

    refresh = RefreshToken.for_user(user)

    return {
        'refresh' : str(refresh) , 
        'access' : str(refresh.access_token),
    }


class RegisterView(APIView):

    def post(self , request):

        serializer = RegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User registered successfully!"},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):

    def post(self , request):
        username = request.data.get("username")
        password = request.data.get("password")


        try:
            login_user = Login_user.objects.get(username=username)
            
            if check_password(password, login_user.password):

                register_user = Register.objects.get(login_user=login_user)

                tokens = generate_tokens_for_user(register_user)

                return Response({
                    "message": "Login successful",
                    "access_token": tokens['access'],
                    "refresh_token": tokens['refresh'],
                    "user_role": register_user.user_role,
                    "redirect_to": "user_dashboard" if register_user.user_role == "User" else "admin_dashboard"
                }, status=status.HTTP_200_OK)
            
            else:

                return Response({"error": "Unauthorized User"}, status=status.HTTP_401_UNAUTHORIZED)

        except Login_user.DoesNotExist:

            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
