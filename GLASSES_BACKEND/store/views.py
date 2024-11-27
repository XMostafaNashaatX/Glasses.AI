from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *


class BookSearch(APIView):

    def get(self, request):
        # Extract the 'title' query parameter
        title_query = request.query_params.get('title', None)

        # Return an error if the query parameter is missing
        if not title_query:
            return Response({"error": "Title query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Filter books with a case-insensitive partial match
        book_titles = Book.objects.filter(title__icontains=title_query)

        # Handle no matching results
        if not book_titles.exists():
            return Response({"message": "No books found matching the title"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the matching books
        serializer = BookSerializer(book_titles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
