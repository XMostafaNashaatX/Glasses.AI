from django.db import models

# Create your models here.


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    year_publication = models.IntegerField()
    publisher = models.CharField(max_length=100)
    image = models.ImageField(upload_to='Book_images/%y/%m/%d')
    price = models.DecimalField(max_digits = 10 , decimal_places=2)

    def __str__(self):
        return self.title
    

