from django.db import models
from register.models import Login_user
from django.contrib.auth.models import User
# Create your models here.


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    year_publication = models.IntegerField()
    publisher = models.CharField(max_length=100)
    image_url_s = models.URLField(null=True, blank=True)
    image_url_m = models.URLField(null=True, blank=True)
    image_url_l = models.URLField(null=True, blank=True)
    price = models.DecimalField(max_digits = 10 , decimal_places=2)

    def __str__(self):
        return self.title
    

class Order(models.Model):
    Status_choices = [
        ('Pending' , 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled' , 'Cancelled')
    ]

    user = models.ForeignKey(User , on_delete=models.CASCADE)
    order_status = models.CharField(
        max_length=20 ,
        choices= Status_choices ,
        default= 'Pending'
    )
    order_date = models.DateTimeField(auto_now_add=True)


    def total_price(self):
        
        return sum(item.total_price() for item in self.order_items.all())

    def __str__(self):
        return f"Order by {self.user.username} ({self.order_status})"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order , on_delete = models.CASCADE , related_name = "order_items")
    item = models.ForeignKey(Book , on_delete= models.CASCADE)
    quantity = models.PositiveIntegerField()

    def total_price(self):
        return self.quantity * self.item.price

    def __str__(self):
        return f"{self.quantity} x {self.item.title} (Total: {self.total_price():.2f}$)"