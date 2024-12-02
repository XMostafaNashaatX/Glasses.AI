from rest_framework.response import Response
from rest_framework import status
from .models import Register
from django.shortcuts import get_object_or_404

def check_users_role(request, role='User'):

    if not request.user.is_authenticated:
        return Response(
            {"error": "Unauthorized User"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        register_user = get_object_or_404(Register, login_user__username=request.user.username)
        if register_user.user_role != role:
            return Response(
                {"error": f"Only Users with role '{role}' can access this feature."},
                status=status.HTTP_403_FORBIDDEN
            )
    except Register.DoesNotExist:
        return Response(
            {"error": "User data not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    return None  


