from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RatingViewSet,
    rate_book,
    update_rating,
    delete_rating,
    user_rating_for_book,
)
from . import views


router = DefaultRouter()
router.register(r"ratings", RatingViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("create/<int:book_id>/", views.rate_book, name="rate_book"),
    path("update/<int:book_id>/", views.update_rating, name="update_rating"),
    path("delete/<int:book_id>/", views.delete_rating, name="delete_rating"),
    path("average_rating/<int:book_id>/", views.average_rating, name="average_rating"),
    path(
        "book/<int:book_id>/", views.user_rating_for_book, name="user_rating_for_book"
    ),
]
