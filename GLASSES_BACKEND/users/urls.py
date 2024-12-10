from django.urls import path
from .views import LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import csrf
from .views import signup


urlpatterns = [
    path("signup/", signup, name="signup"),
    path("login/", LoginView.as_view(), name="login"),  # This is the login view
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_view"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("csrf/", csrf, name="csrf"),  # You can remove CSRF view if not used
]
