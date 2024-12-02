from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User


def check_users_role(request, role='User'):

    if not request.user.is_authenticated:
        return Response(
            {"error": "Unauthorized User"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    user = get_object_or_404(User, username=request.user.username)
    
    if user.is_staff: 
        user_role = 'Admin'
    else:
        user_role = 'User'

    if user_role != role:
        return Response(
            {"error": f"Only Users with the role '{role}' can access this feature."},
            status=status.HTTP_403_FORBIDDEN
        )

    return None