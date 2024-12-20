from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Cart, CartItem
from store.models import Book
from .serializers import CartSerializer, CartItemSerializer


# AddToCartView
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication

    def post(self, request):
        book_id = request.data.get("book_id")
        quantity = request.data.get("quantity", 1)

        if not book_id:
            return Response(
                {"error": "Book ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        book = Book.objects.filter(id=book_id).first()
        if not book:
            return Response(
                {"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND
            )

        cart, created = Cart.objects.get_or_create(user=request.user)

        # Check if the item already exists in the cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book)
        if not created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = int(quantity)
        cart_item.save()

        return Response({"message": "Item added to cart"}, status=status.HTTP_200_OK)


# CartView
class CartView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication

    def get(self, request):
        try:
            cart, created = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# UpdateQuantityView
class UpdateQuantityView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication

    def patch(self, request, item_id):
        action = request.data.get("action")
        if action not in ["+", "-"]:
            return Response(
                {"error": "Invalid action. Use 'increase' or 'decrease'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item = CartItem.objects.filter(id=item_id, cart__user=request.user).first()
        if not cart_item:
            return Response(
                {"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if action == "+":
            cart_item.quantity += 1
        elif action == "-":
            if cart_item.quantity > 1:
                cart_item.quantity -= 1
            else:
                return Response(
                    {"error": "Quantity cannot be less than 1."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        cart_item.save()

        return Response(
            {"message": f"Quantity {action}d successfully"}, status=status.HTTP_200_OK
        )


# RemoveFromCartView
class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication

    def delete(self, request, item_id):
        cart_item = CartItem.objects.filter(id=item_id, cart__user=request.user).first()
        if not cart_item:
            return Response(
                {"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()
        return Response(
            {"message": "Item removed from cart"}, status=status.HTTP_200_OK
        )


# ClearCartView
class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication

    def delete(self, request):
        try:
            cart = Cart.objects.filter(user=request.user).first()
            if not cart:
                return Response(
                    {"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Delete all items in the cart
            cart.items.all().delete()

            return Response(
                {"message": "All items removed from cart"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# CalculateTotalView
class CalculateTotalView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication

    def get(self, request):
        try:
            cart = Cart.objects.filter(user=request.user).first()
            if not cart:
                return Response(
                    {"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Calculate the total price
            total = sum(item.price * item.quantity for item in cart.items.all())

            return Response({"total": total}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
