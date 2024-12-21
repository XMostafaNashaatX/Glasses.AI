from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LoginView, ProfileView, UpdateProfileView
from .views import signup

urlpatterns = [
    path("signup/", signup, name="signup"),
    path("login/", LoginView.as_view(), name="login"),  # JWT login view
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_view"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "profile/", ProfileView.as_view(), name="view_profile"
    ),  # GET request to view profile
    path(
        "profile/update/", UpdateProfileView.as_view(), name="update_profile"
    ),  # PUT request to update profile
]
