# cart/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from store.serializers import BookSerializer  # Assuming you have a Book serializer


class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = CartItem
        fields = ["book", "quantity", "total_price"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ["user", "items"]
