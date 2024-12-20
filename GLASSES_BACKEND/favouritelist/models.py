from django.db import models
from django.contrib.auth.models import User
from store.models import Book

# Create your models here.
class FavoriteList(models.Model):
    user = models.OneToOneField(User , on_delete=models.CASCADE , related_name="favorite_list")
    created_at = models.DateField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username}'s Favorite List"
    
class FavoriteListItem(models.Model):
    favorite_list = models.ForeignKey(FavoriteList , on_delete=models.CASCADE , related_name="items")
    book = models.ForeignKey(Book , on_delete=models.CASCADE , related_name="favorite_list_items")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['favorite_list', 'book'], name='unique_favorite_list_item')
        ]

    def __str__(self):
         return f"{self.favorite_list.user.username} -> {self.book.title}"
    

