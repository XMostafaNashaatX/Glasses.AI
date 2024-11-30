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

    item = models.ForeignKey(Book , on_delete= models.CASCADE)
    quantity = models.PositiveIntegerField()
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    order_status = models.CharField(
        max_length=20 ,
        choices= Status_choices ,
        default= 'PENDING'
    )
    order_date = models.DateTimeField(auto_now_add=True)


    def total_price(self):
        return self.quantity * self.item.price
    
    def __str__(self):
        return (f"Order by {self.user.username} : ({self.item.title} x {self.quantity})"
                f"({self.order_status}) -> Total Price : {self.total_price():.2f}$"
        )
    
   