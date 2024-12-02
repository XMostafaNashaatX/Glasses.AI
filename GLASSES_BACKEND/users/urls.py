from django.urls import path
from .views import LoginView, signup
from .views import EditProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import csrf
from . import views
from .views import user_profile

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("api/users/profile/", EditProfileView.as_view(), name="edit_profile"),
    path("login/", LoginView.as_view(), name="login"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_view"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("csrf/", csrf, name="csrf"),
    path("users/profile/", user_profile, name="user_profile"),
]
