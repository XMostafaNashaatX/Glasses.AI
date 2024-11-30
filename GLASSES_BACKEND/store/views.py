from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  , generics
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from register.serializers import *
from register.models import *
from register.views import *
from users.utils import check_users_role


class BookSearch(APIView):

    def post(self, request):

        role_check = check_users_role(request , role='User')

        if role_check:
            return role_check
             
        
        title_query = request.data.get('title', '').strip()

        if not title_query:
            return Response(
                {"error": "Title is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        book_titles = Book.objects.filter(title__icontains=title_query)

        if not book_titles.exists():
            return Response(
                {"message": "No books found matching the title"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = BookSerializer(book_titles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Add_Order(APIView):
    
    def post(self, request):

        role_check = check_users_role(request, role='User')
        if role_check:
            return role_check

        books_data = request.data.get("books")  
        
        if not books_data:
            return Response(
                {"error": "Books data is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(books_data) == 0:
            return Response(
                {"error": "Books data should contain at least one item"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order_items = []
        for book_data in books_data:
            book_id = book_data.get("book_id")
            quantity = book_data.get("quantity")

            if not book_id or quantity is None:
                return Response(
                    {"error": "Book title and quantity are required for each item"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if quantity <= 0:
                return Response(
                    {"error": "Quantity must be greater than 0 for each item"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            books = Book.objects.filter(id = book_id)
            if not books.exists():
                return Response(
                    {"error": f"No books found with this Id '{book_id}'"},
                    status=status.HTTP_404_NOT_FOUND
                )

            book = books.first() 
            order_items.append((book, quantity))


        order = Order.objects.create(user=request.user, order_status="Pending")

        for book, quantity in order_items:
            OrderItem.objects.create(order=order, item=book, quantity=quantity)  

        serializer = OrderSerializer(order)
        return Response(
            {"message": "Order created successfully", "order": serializer.data},
            status=status.HTTP_201_CREATED
        )


class Cancel_Order(APIView):

    def post(self , request):
        role_check = check_users_role(request, role='User')
        if role_check:
            return role_check
        
        order_id = request.data.get("order_id")

        if not order_id:
            return Response(
                {"error": "Order ID is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        try:

            order = Order.objects.get(id=order_id, user= request.user)

            if order.order_status != "Pending":
                return Response(
                    {"error": "Only (Pending) orders can be cancelled"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            order.order_status = "Cancelled"
            order.save()

            serializer = OrderSerializer(order)
            return Response(
                {"message": "Order cancelled successfully", "order": serializer.data},
                status=status.HTTP_200_OK
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or user is not authorized to cancel this order"},
                status=status.HTTP_404_NOT_FOUND
            )


class Update_order(APIView):
    def post(self, request):
        role_check = check_users_role(request, role='User')
        if role_check:
            return role_check

        order_id = request.data.get("order_id")
        book_id = request.data.get("book_id")  
        new_quantity = request.data.get("quantity")

        if not order_id:
            return Response(
                {"error": "Order ID is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not book_id:
            return Response(
                {"error": "Book ID is required to update the quantity"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_quantity is None:
            return Response(
                {"error": "Quantity is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            order = Order.objects.get(id=order_id, user=request.user)
            
            order_item = order.order_items.filter(item__id=book_id).first()

            if not order_item:
                return Response(
                    {"error": f"No item with Book ID '{book_id}' found in this order"},
                    status=status.HTTP_404_NOT_FOUND
                )

            order_item.quantity = new_quantity
            order_item.save()

            order.save()

            serializer = OrderSerializer(order)
            return Response(
                {"message": "Order item updated successfully", "order": serializer.data},
                status=status.HTTP_200_OK
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or user is not authorized to update this order"},
                status=status.HTTP_404_NOT_FOUND
            )

        


        