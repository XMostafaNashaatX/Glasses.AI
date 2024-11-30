import paypalrestsdk
from django.conf import settings

# Set up PayPal SDK configuration
paypalrestsdk.configure(
    {
        "mode": "sandbox",  # sandbox or live
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_SECRET,
    }
)
