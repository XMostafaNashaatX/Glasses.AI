from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RatingViewSet, rate_book, update_rating, delete_rating
from . import views


router = DefaultRouter()
router.register(r"ratings", RatingViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("create/", views.rate_book, name="rate_book"),
    path("update/<int:book_id>/", views.update_rating, name="update_rating"),
    path("delete/<int:book_id>/", views.delete_rating, name="delete_rating"),
]
