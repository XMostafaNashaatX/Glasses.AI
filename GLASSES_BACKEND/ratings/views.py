from .models import Rating
from .serializers import RatingSerializer
from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Rating, Book
from users.utils import check_users_role

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Rating.objects.all()
        book_id = self.request.query_params.get("book_id", None)
        user_id = self.request.query_params.get("user_id", None)

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        if user_id:
            queryset = queryset.filter(user_id=user_id)


# @api_view(["POST"])
# def rate_book(request, book_id):
#     try:
#         book = Book.objects.get(pk=book_id)
#     except Book.DoesNotExist:
#         return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
#
#     try:
#         rating = Rating.objects.get(book=book, user=request.user)
#     except Rating.DoesNotExist:
#         rating = None
#
#     if rating is not None:
#         return Response(
#             {"error": "You have already rated this book"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )
#
#     serializer = RatingSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(book=book, user=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def rate_book(request):

    role_check = check_users_role(request, role="User")

    if role_check:
        return role_check

    if not request.user.is_authenticated:
        return Response(
            {"error": "You must be logged in to rate a book."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


    book_id = request.data.get("book_id")
    score = request.data.get("score")
    review = request.data.get("review")


    if not book_id or not score or not review:
        return Response(
            {"error": "book_id, score, and review are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)


    if Rating.objects.filter(book=book, user=request.user).exists():
        return Response(
            {"error": "You have already rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    data = {
        "book": book.id,
        "user": request.user.id,
        "score": score,
        "review": review,
    }


    serializer = RatingSerializer(data=data)
    if serializer.is_valid():

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def update_rating(request, book_id):
    """
    Update an existing rating for a specific book by the current user.
    """

    role_check = check_users_role(request, role="User")

    if role_check:
        return role_check
    
    if not request.user.is_authenticated:
        return Response(
            {"error": "You must be logged in to update your rating."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        rating = Rating.objects.get(book=book, user=request.user)
    except Rating.DoesNotExist:
        return Response(
            {"error": "You have not rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )

   
    serializer = RatingSerializer(
        rating, data=request.data, partial=True
    )  
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_rating(request, book_id):


    role_check = check_users_role(request, role="User")

    if role_check:
        return role_check
    
    if not request.user.is_authenticated:
        return Response(
            {"error": "You must be logged in to delete a rating."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        rating = Rating.objects.get(book=book, user=request.user)
    except Rating.DoesNotExist:
        return Response(
            {"error": "You have not rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    rating.delete()

    return Response(
        {"message": "Rating deleted successfully."}, status=status.HTTP_204_NO_CONTENT
    )
