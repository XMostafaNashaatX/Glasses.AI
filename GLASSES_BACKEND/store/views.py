from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer


class BookSearch(APIView):
    """
    This API view allows users to search for a book by title via a POST request.
    Returns all the book details if the title query matches.
    """

    def post(self, request):
        # Extract the 'title' from the request body (JSON data)
        title_query = request.data.get('title', '').strip()

        # Check if the title was provided and is not empty
        if not title_query:
            return Response(
                {"error": "Title is required in the request body"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Filter books with a case-insensitive partial match
        book_titles = Book.objects.filter(title__icontains=title_query)

        # If no books match the title
        if not book_titles.exists():
            return Response(
                {"message": "No books found matching the title"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the list of matching books and return as JSON response
        serializer = BookSerializer(book_titles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
