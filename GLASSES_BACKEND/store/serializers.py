from rest_framework import serializers
from .models import *


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    item = BookSerializer()  # Change book to item to match the model field

    class Meta:
        model = OrderItem
        fields = ['item', 'quantity']  # Make sure this matches the model fields


class OrderSerializer(serializers.ModelSerializer):

    order_items = OrderItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['user', 'order_status', 'order_date', 'order_items', 'total_price']
        read_only_fields = ['total_price']

    def get_total_price(self, order):
        return order.total_price()
        
    



