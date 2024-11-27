from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from .models import Login
from .serializer import LoginSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ParseError


class LoginView(APIView):
    def get(self, request):
        """
        Show all login entries (for testing purposes).
        """
        logins = Login.objects.all()
        serializer = LoginSerializer(logins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handle user login.
        """
        try:
            # Deserialize and validate incoming data
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                # Validate against existing entries (example scenario)
                username = serializer.validated_data['username']
                password = serializer.validated_data['password']
                user = Login.objects.filter(username=username, password=password).first()
                if user:
                    return Response(
                        {"message": "Login successful", "username": user.username},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "Invalid username or password"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
        except ParseError:
            return Response({"detail": "Invalid JSON payload."}, status=status.HTTP_400_BAD_REQUEST)
