import paypalrestsdk
from django.conf import settings
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from store.models import Book
from payments.models import Payment
from carts.models import Cart, CartItem
import stripe


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


# Configure Stripe with your secret key
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Require JWT authentication
def create_visa_payment(request):
    user = request.user

    # Fetch the user's cart
    cart = get_object_or_404(Cart, user=user)
    cart_items = cart.items.all()

    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    # Calculate total amount for the cart items
    calculated_total_price = sum(
        float(item.price) * item.quantity for item in cart_items
    )

    try:
        # Create a PaymentIntent for Visa (Stripe's way of handling card payments)
        payment_intent = stripe.PaymentIntent.create(
            amount=int(calculated_total_price * 100),  # Stripe accepts amount in cents
            currency="usd",
            payment_method_types=["card"],  # Visa card payment method
        )

        # Create a Payment record in the database (with a 'pending' status)
        payment = Payment.objects.create(
            user=user,
            amount=calculated_total_price,
            transaction_id=payment_intent.id,
            payment_method="visa",
            status="pending",  # Set as pending until confirmed
            payment_intent_id=payment_intent.id,
        )

        return Response({"client_secret": payment_intent.client_secret})

    except stripe.error.StripeError as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Require JWT authentication
def execute_visa_payment(request):
    user = request.user
    payment_intent_id = request.data.get("payment_intent_id")

    if not payment_intent_id:
        return Response({"error": "Payment Intent ID is required"}, status=400)

    try:
        # Retrieve the PaymentIntent from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        if payment_intent.status == "succeeded":
            # Payment was successful
            charge = payment_intent.charges.data[0]
            card_last4 = charge.payment_method_details.card.last4
            card_brand = charge.payment_method_details.card.brand

            # Update the Payment record in the database
            payment = get_object_or_404(
                Payment, transaction_id=payment_intent.id, user=user
            )
            payment.status = "completed"
            payment.card_last4 = card_last4
            payment.card_brand = card_brand
            payment.save()

            # Clear the cart after successful payment
            cart = get_object_or_404(Cart, user=user)
            cart.items.clear()
            cart.save()

            return Response(
                {
                    "message": "Visa payment successful",
                    "transaction_id": payment_intent.id,
                }
            )

        else:
            return Response({"error": "Payment not successful"}, status=400)

    except stripe.error.StripeError as e:
        return Response({"error": str(e)}, status=500)

    except Payment.DoesNotExist:
        return Response({"error": "Payment not found for this user."}, status=404)
