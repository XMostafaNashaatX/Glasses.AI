from django.http import JsonResponse
from rest_framework.views import APIView
from .utils import recommend_books_for_user  # Assuming recommend_books_for_user is imported correctly
from rest_framework.permissions import IsAuthenticated

class RecommendationView(APIView):
    def get(self, request):
        user = request.user

        recommendations = recommend_books_for_user(user, top_n=10)
        
        data = []
        for book in recommendations:
            book_data = {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "year_publication": book.year_publication,
                "publisher": book.publisher,
                "image_url_s": book.image_url_s,  
                "image_url_m": book.image_url_m,  
                "image_url_l": book.image_url_l,  
                "price": str(book.price),  
                "categories": [category.name for category in book.categories.all()],
            }
            data.append(book_data)
        
        return JsonResponse({"recommendations": data})

