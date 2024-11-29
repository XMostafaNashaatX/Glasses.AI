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
        # Step 1: Role check for 'User'
        role_check = check_users_role(request, role='User')
        if role_check:
            return role_check

        # Step 2: Retrieve the data from the request body
        book_title = request.data.get("book_title")
        quantity = request.data.get("quantity")

        # Step 3: Validate the required fields
        if not book_title or not quantity:
            return Response(
                {"error": "Book title and Quantity are required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate quantity to be greater than 0
        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 4: Check if the book exists
        books = Book.objects.filter(title__icontains=book_title)
        if not books.exists():
            return Response(
                {"error": "No books found matching the given title"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Retrieve the first matching book
        book = books.first()

        # Step 5: Get the authenticated user based on request.user
        try:
            # Check if the user exists in the Register model
            register_user = Register.objects.get(username=request.user.username)

            # Get the Login_user instance associated with this Register user
            login_user = register_user.login_user  # Accessing the Login_user through the one-to-one relationship
        except Register.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Step 6: Create the order in the database
        order = Order.objects.create(
            user=login_user,  # Assigning the Login_user instance
            item=book,
            quantity=quantity,
            order_status="Pending"
        )

        # Step 7: Serialize the order and send a success response
        serializer = OrderSerializer(order)
        return Response(
            {"message": "Order created successfully", "order": serializer.data},
            status=status.HTTP_201_CREATED
        )


class Cancel_Order(APIView):

    def post(self , request):
        pass 

class Update_order(APIView):
    pass