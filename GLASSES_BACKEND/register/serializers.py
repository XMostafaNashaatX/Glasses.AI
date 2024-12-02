from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login_user
        fields = ('username', 'password', 'email')
        extra_kwargs = {
            'password': {'write_only': True}
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Register
        fields = ['username', 'password', 'email', 'user_role']
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def create(self, validated_data):

        password = validated_data.pop('password')
        hashed_password = make_password(password)

        login_user = Login_user.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),  
            password=hashed_password
        )

        register_user = Register.objects.create(
            login_user=login_user,
            **validated_data
        )

        return register_user
