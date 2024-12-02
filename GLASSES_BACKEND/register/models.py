from django.db import models

# Create your models here.

class Login_user(models.Model):
    username = models.CharField(max_length=100 , unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=100 , null=True , blank=True)

    def __str__(self):
        return self.username
    

    

class Register(models.Model):

    Role_Choices = [
        ('User' , 'User'),
        ('Admin' , 'Admin'),
    ]

    login_user = models.OneToOneField(Login_user, on_delete=models.CASCADE)
    username = models.CharField(max_length=100 , unique=True)
    email = models.EmailField(max_length=100 , null=True , blank=True)
    password = models.CharField(max_length=100 )
    user_role = models.CharField(max_length=10 , choices=Role_Choices , default='User')

    def __str__(self):
        return f"{self.username} ({self.user_role})"