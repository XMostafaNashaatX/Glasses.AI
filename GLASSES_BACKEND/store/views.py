from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  , generics
from .models import Book , Order
from .serializers import BookSerializer


class BookSearch(APIView):

    def post(self, request):
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
    
    def post(self , request):
        pass


class Cancel_Order(APIView):

    def post(self , request):
        pass 

class Update_order(APIView):
    pass