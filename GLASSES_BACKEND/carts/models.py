from django.db import models
from django.contrib.auth.models import User
from store.models import Book  # Import Book model from store app


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def save(self, *args, **kwargs):
        # Automatically set the price to the book's price when saving
        if not self.price:
            self.price = self.book.price * self.quantity
        else:
            self.price = self.book.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.quantity} x {self.book.title} in {self.cart.user.username}'s Cart"
        )
