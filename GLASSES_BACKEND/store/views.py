from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  , generics
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from register.serializers import *
from register.models import *
from register.views import *
from register.utils import check_users_role


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

        book_title = request.data.get("book_title")
        quantity = request.data.get("quantity")

        if not book_title or not quantity:
            return Response(
                {"error": "Book title and Quantity are required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST
            )

        books = Book.objects.filter(title__icontains=book_title)
        if not books.exists():
            return Response(
                {"error": "No books found matching the given title"},
                status=status.HTTP_404_NOT_FOUND
            )

        book = books.first()

        try:
            register_user = Register.objects.get(username=request.user.username)

            login_user = register_user.login_user 
        except Register.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        order = Order.objects.create(
            user=login_user,  
            item=book,
            quantity=quantity,
            order_status="Pending"
        )

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

            register_user = Register.objects.get(username=request.user.username)

            login_user = register_user.login_user 

            order = Order.objects.get(id=order_id, user= login_user)

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
    
    def post(self , request):

        role_check = check_users_role(request, role='User')
        if role_check:
            return role_check
        
        order_id = request.data.get("order_id")
        new_quantity = request.data.get("quantity")

        if not order_id:
            return Response(
                {"error": "Order ID is required in the request body"},
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

            register_user = Register.objects.get(username=request.user.username)

            login_user = register_user.login_user

            order = Order.objects.get(id=order_id, user= login_user)

            order.quantity = new_quantity

            order.save()

            serializer = OrderSerializer(order)
            return Response(
                {"message": "Order updated successfully", "order": serializer.data},
                status=status.HTTP_200_OK
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or user is not authorized to update this order"},
                status=status.HTTP_404_NOT_FOUND
            )
        


        