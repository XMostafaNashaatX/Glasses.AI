from django.urls import path
from .views import UserCreate, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import csrf
from . import views

urlpatterns = [
    path("registration", UserCreate.as_view(), name="registration"),
    path("login/", LoginView.as_view(), name="login"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_view"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("csrf/", csrf, name="csrf"),
]

