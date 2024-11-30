from .models import Rating
from .serializers import RatingSerializer
from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Rating, Book


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
    # Ensure that the user is logged in
    if not request.user.is_authenticated:
        return Response(
            {"error": "You must be logged in to rate a book."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Get the book_id, score, and review from the request data
    book_id = request.data.get("book_id")
    score = request.data.get("score")
    review = request.data.get("review")

    # Check if all required fields are provided
    if not book_id or not score or not review:
        return Response(
            {"error": "book_id, score, and review are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Try to retrieve the book from the database using the book_id
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has already rated this book
    if Rating.objects.filter(book=book, user=request.user).exists():
        return Response(
            {"error": "You have already rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Prepare the data for the serializer
    data = {
        "book": book.id,
        "user": request.user.id,
        "score": score,
        "review": review,
    }

    # Serialize the data and create the rating
    serializer = RatingSerializer(data=data)
    if serializer.is_valid():
        # Save the new rating
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def update_rating(request, book_id):
    """
    Update an existing rating for a specific book by the current user.
    """
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response(
            {"error": "You must be logged in to update your rating."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Try to get the book by its ID
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    # Try to find the rating made by the current user for the specific book
    try:
        rating = Rating.objects.get(book=book, user=request.user)
    except Rating.DoesNotExist:
        return Response(
            {"error": "You have not rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Ensure the incoming data is valid and contains the expected fields
    serializer = RatingSerializer(
        rating, data=request.data, partial=True
    )  # partial=True allows partial update
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_rating(request, book_id):
    """
    Delete a rating for a specific book by the current user.
    Only the user who rated the book can delete their own rating.
    """
    # Check if the user is authenticated
    if not request.user.is_authenticated:
        return Response(
            {"error": "You must be logged in to delete a rating."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Try to get the book by its id
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    # Try to find the rating made by the current user for the specified book
    try:
        rating = Rating.objects.get(book=book, user=request.user)
    except Rating.DoesNotExist:
        return Response(
            {"error": "You have not rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Delete the rating
    rating.delete()

    # Return success response
    return Response(
        {"message": "Rating deleted successfully."}, status=status.HTTP_204_NO_CONTENT
    )
