from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from store.models import Book


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the user's cart."""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Add a book to the cart."""
        book_id = request.data.get("book_id")
        quantity = request.data.get("quantity", 1)

        if not book_id:
            return Response(
                {"error": "Book ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Retrieve the book
        book = get_object_or_404(Book, id=book_id)
        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book)
        if not created:
            cart_item.quantity += (
                quantity  # Increase the quantity if item already exists
            )
            cart_item.save()

        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_201_CREATED,
        )


class UpdateQuantityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Update the quantity of an item in the cart."""
        cart_item_id = request.data.get("cart_item_id")
        quantity = request.data.get("quantity")

        if not cart_item_id or quantity is None:
            return Response(
                {"error": "Cart item ID and quantity are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart = Cart.objects.get(user=request.user)
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
        cart_item.quantity = quantity
        cart_item.save()

        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_200_OK,
        )


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Remove an item from the cart."""
        cart_item_id = request.data.get("cart_item_id")

        if not cart_item_id:
            return Response(
                {"error": "Cart item ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart = Cart.objects.get(user=request.user)
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
        cart_item.delete()

        return Response(
            {"message": "Item removed from cart"},
            status=status.HTTP_204_NO_CONTENT,
        )
