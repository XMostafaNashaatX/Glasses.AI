import paypalrestsdk
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from store.models import Book
from payments.models import Payment
from carts.models import Cart, CartItem

# PayPal configuration
paypalrestsdk.configure(
    {
        "mode": settings.PAYPAL_MODE,
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_CLIENT_SECRET,
    }
)


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Require JWT authentication
def create_payment(request):
    user = request.user

    # Fetch the cart for the authenticated user
    cart = get_object_or_404(Cart, user=user)
    cart_items = cart.items.all()  # Use the related_name 'items'

    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    # Build the PayPal payment details
    calculated_total_price = 0

    # Prepare item list for PayPal
    items = []
    for item in cart_items:
        book = item.book
        quantity = item.quantity
        price = float(item.price)  # Price from CartItem model
        total_item_price = price * quantity
        calculated_total_price += total_item_price

        items.append(
            {
                "name": book.title,
                "sku": str(book.id),
                "price": str(price),  # Individual book price
                "currency": "USD",
                "quantity": quantity,
            }
        )

    # Round total price to two decimal places to match PayPal's format
    calculated_total_price = round(calculated_total_price, 2)

    # Now create the PayPal payment with the correct total
    payment = paypalrestsdk.Payment(
        {
            "intent": "sale",
            "payer": {"payment_method": "paypal"},
            "redirect_urls": {
                "return_url": "http://127.0.0.1:8000/payments/execute/",
                "cancel_url": "http://localhost:5173/checkout/",
            },
            "transactions": [
                {
                    "item_list": {"items": items},
                    "amount": {
                        "total": f"{calculated_total_price:.2f}",
                        "currency": "USD",
                    },
                    "description": "Payment for items in cart",
                }
            ],
        }
    )

    # Create payment and check for errors
    if payment.create():
        approval_url = next(
            link.href for link in payment.links if link.rel == "approval_url"
        )
        return Response({"approval_url": approval_url})
    else:
        print(f"Error creating payment: {payment.error}")
        return Response(
            {"error": "Payment creation failed", "details": payment.error}, status=500
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def execute_payment(request):
    payment_id = request.query_params.get("paymentId")
    payer_id = request.query_params.get("PayerID")

    # Execute payment using PayPal's API
    payment = paypalrestsdk.Payment.find(payment_id)
    if payment.execute({"payer_id": payer_id}):
        # Create payment record in database
        for item in payment.transactions[0].item_list.items:
            book = Book.objects.get(id=item.sku)
            Payment.objects.create(
                book=book,
                amount=item.price,
                transaction_id=payment.id,
                status=payment.state,
            )

        # Mark cart as paid or clear it
        cart = Cart.objects.get(user=request.user)
        cart.items.clear()  # Clear the cart after successful payment
        cart.save()

        return Response(
            {"message": "Payment successful", "transaction_id": payment.id}, status=200
        )
    else:
        return Response({"error": "Payment execution failed"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Require JWT authentication
def cancel_payment(request):
    return Response({"message": "Payment was canceled by user"})
