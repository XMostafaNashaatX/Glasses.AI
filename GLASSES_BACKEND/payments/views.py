import paypalrestsdk
from django.conf import settings
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from store.models import Book
from payments.models import Payment

# PayPal configuration
paypalrestsdk.configure(
    {
        "mode": settings.PAYPAL_MODE,
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_CLIENT_SECRET,
    }
)


@api_view(["POST"])
def create_payment(request):
    book_id = request.data.get("book_id")

    # Get the book object from the store app
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)

    # Create PayPal payment
    payment = paypalrestsdk.Payment(
        {
            "intent": "sale",
            "payer": {"payment_method": "paypal"},
            "redirect_urls": {
                "return_url": "http://127.0.0.1:8000/payments/execute/",
                "cancel_url": "http://127.0.0.1:8000/payments/cancel/",
            },
            "transactions": [
                {
                    "item_list": {
                        "items": [
                            {
                                "name": book.title,
                                "sku": str(book.id),
                                "price": str(book.price),
                                "currency": "USD",
                                "quantity": 1,
                            }
                        ]
                    },
                    "amount": {"total": str(book.price), "currency": "USD"},
                    "description": f"Payment for {book.title}",
                }
            ],
        }
    )

    if payment.create():
        # Redirect the user to PayPal for approval
        approval_url = next(
            link.href for link in payment.links if link.rel == "approval_url"
        )
        return Response({"approval_url": approval_url})
    else:
        return Response({"error": "Payment creation failed"}, status=500)


@api_view(["GET"])
def execute_payment(request):
    payment_id = request.query_params.get("paymentId")
    payer_id = request.query_params.get("PayerID")

    # Execute payment using PayPal's API
    payment = paypalrestsdk.Payment.find(payment_id)
    if payment.execute({"payer_id": payer_id}):
        # Create payment record in database
        book = Book.objects.get(id=payment.transactions[0].item_list.items[0].sku)
        payment_record = Payment.objects.create(
            book=book,
            amount=payment.transactions[0].amount.total,
            transaction_id=payment.id,
            status=payment.state,
        )
        return Response({"message": "Payment successful", "transaction_id": payment.id})
    else:
        return Response({"error": "Payment execution failed"}, status=500)


@api_view(["GET"])
def cancel_payment(request):
    return Response({"message": "Payment was canceled by user"})
