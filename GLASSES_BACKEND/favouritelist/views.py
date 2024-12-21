from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import FavoriteList, FavoriteListItem
from .serializers import FavoriteListItemSerializer, AddFavoriteListItemSerializer
from django.shortcuts import get_object_or_404
from users.utils import check_users_role
from store.models import *


# Create your views here.

class Retrieve_FavoriteList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            favorite_list, created = FavoriteList.objects.get_or_create(user=request.user)

            favorite_items = favorite_list.items.all()

            books_data = [
                {
                    "id": item.book.id,
                    "title": item.book.title,
                    "author": item.book.author,
                    "year_publication": item.book.year_publication,
                    "publisher": item.book.publisher,
                    "image_url_s": item.book.image_url_s,
                    "image_url_m": item.book.image_url_m,
                    "image_url_l": item.book.image_url_l,
                    "price": str(item.book.price),  
                }
                for item in favorite_items
            ]

            return Response(books_data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "An error occurred while fetching the favorite list."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserFavoriteItem(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        user = request.user
        favorite_list = FavoriteList.objects.filter(user=user).first()
        if not favorite_list:
            return Response({"is_favorite": False}, status=status.HTTP_200_OK)
        
        is_favorite = favorite_list.items.filter(book_id=book_id).exists()
        return Response({"is_favorite": is_favorite}, status=status.HTTP_200_OK)


class AddToFavoriteList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        role_check = check_users_role(request, role="User")
        if role_check:
            return role_check

        books_data = request.data.get("books")
        if not books_data:
            return Response(
                {"error": "Books data is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(books_data) == 0:
            return Response(
                {"error": "Books data should contain at least one item"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        favorite_list, _ = FavoriteList.objects.get_or_create(user=request.user)
        favorite_items = []

        for book_data in books_data:
            book_id = book_data.get("book_id")

            if not book_id:
                return Response(
                    {"error": "Book ID is required for each item"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            book = Book.objects.filter(id=book_id).first()
            if not book:
                return Response(
                    {"error": f"No book found with ID '{book_id}'"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if favorite_list.items.filter(book=book).exists():
                continue
            
            favorite_items.append(FavoriteListItem(favorite_list=favorite_list, book=book))

        FavoriteListItem.objects.bulk_create(favorite_items)

        serializer = FavoriteListItemSerializer(favorite_list.items.all(), many=True)
        return Response(
            {
                "message": "Books added to your favorite list successfully",
                "favorite_list": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )



class RemoveFromFavoriteList(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, book_id):
        user = request.user
        favorite_list = get_object_or_404(FavoriteList, user=user)
        favorite_item = favorite_list.items.filter(book_id=book_id).first()
        if not favorite_item:
            return Response(
                {"message": "Book is not in your favorite list."},
                status=status.HTTP_404_NOT_FOUND,
            )
        favorite_item.delete()
        return Response({"message": "Book removed from your favorite list."}, status=status.HTTP_200_OK)