from django.db import models
from store.models import Book


class Payment(models.Model):
    books = models.ManyToManyField(Book)  # Multiple books
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=200, unique=True)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.book.title} - {self.transaction_id}"
