from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    profile_image = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        default=" ",
    )

    def __str__(self):
        return f"{self.user.username}'s profile"
