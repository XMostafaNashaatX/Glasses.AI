from rest_framework import serializers
from .models import FavoriteList, FavoriteListItem
from store.models import Book
from store.serializers import BookSerializer



class FavoriteListItemSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = FavoriteListItem
        fields = ('book', 'added_at')


class AddFavoriteListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteListItem
        fields = ('book' ,)