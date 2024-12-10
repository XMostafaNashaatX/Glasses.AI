from django.db import models
from store.models import Book
from django.contrib.auth.models import User


class Rating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="ratings")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    score = models.FloatField()
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Rating for {self.book.title} ({self.score}) by {self.user.username}"
