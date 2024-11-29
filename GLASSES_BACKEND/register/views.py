from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Login_user, Register
from .serializers import *
from django.contrib.auth.hashers import check_password
from django.middleware.csrf import get_token
from django.http import JsonResponse


# View to handle user registration
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to handle user login with CSRF token
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            login_user = Login_user.objects.get(username=username)

            if check_password(password, login_user.password):
                register_user = Register.objects.get(login_user=login_user)

                # Generate CSRF token for the user
                csrf_token = get_token(request)

                # You can use session-based authentication after this
                # By default, Django will create a session cookie for the logged-in user

                return Response(
                    {
                        "message": "Login successful",
                        "user_role": register_user.user_role,
                        "redirect_to": (
                            "user_dashboard"
                            if register_user.user_role == "User"
                            else "admin_dashboard"
                        ),
                        "csrf_token": csrf_token,  # CSRF token for frontend usage
                    },
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(
                    {"error": "Unauthorized User"}, status=status.HTTP_401_UNAUTHORIZED
                )

        except Login_user.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


# CSRF token generation endpoint (to be used in your frontend)
def csrf(request):
    """Generate and return a CSRF token."""
    try:
        csrf_token = get_token(request)
        return JsonResponse({"csrf_token": csrf_token})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
