from django.db import models

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
    

