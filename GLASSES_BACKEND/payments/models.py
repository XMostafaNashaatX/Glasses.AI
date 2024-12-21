from django.db import models
from django.contrib.auth.models import User


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    payment_intent_id = models.CharField(max_length=255, null=True, blank=True)
    card_last4 = models.CharField(max_length=4, null=True, blank=True)
    card_brand = models.CharField(max_length=20, null=True, blank=True)

    # Other fields if necessary

    def __str__(self):
        return f"Payment {self.transaction_id} for {self.user.username}"
