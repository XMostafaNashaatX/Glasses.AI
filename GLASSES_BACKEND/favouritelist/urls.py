from django.urls import path
from .views import *

urlpatterns = [
    path('get_all/', Retrieve_FavoriteList.as_view(), name='retrieve_favorite_list'),
    path('add/', AddToFavoriteList.as_view(), name='add_to_favorite'),
    path('remove/<int:book_id>/', RemoveFromFavoriteList.as_view(), name='remove_from_favorite'),
     path('check/<int:book_id>/', UserFavoriteItem.as_view(), name='user_favorite_item'),
]
