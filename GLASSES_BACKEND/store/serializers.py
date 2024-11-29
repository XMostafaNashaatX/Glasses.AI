from rest_framework import serializers
from .models import *


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):

    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['item' , 'quantity' , 'user' , 'order_status' ,  'total_price']
        read_only_fields = ['total_price']

    def  get_total_price(self , order):
            return order.total_price()
        
    



