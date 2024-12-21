from .models import Rating
from .serializers import UserRatingSerializer
from .serializers import RatingSerializer
from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Rating, Book
from users.utils import check_users_role
from django.db.models import Avg
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny
from store.serializers import BookSerializer 

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        queryset = Rating.objects.all()
        book_id = self.request.query_params.get("book_id", None)
        user_id = self.request.query_params.get("user_id", None)

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset


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
@permission_classes([IsAuthenticated])
def rate_book(request, book_id):
    """
    Create a rating for a book by the authenticated user.
    """
    role_check = check_users_role(request, role="User")
    if role_check:
        return role_check

    # Ensure score and review are provided
    score = request.data.get("score")
    review = request.data.get("review")
    if not score or not review:
        return Response(
            {"error": "Both 'score' and 'review' fields are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Fetch the book
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check for existing rating
    if Rating.objects.filter(book=book, user=request.user).exists():
        return Response(
            {"error": "You have already rated this book."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Create and save rating
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
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH", "PUT"])
@permission_classes([IsAuthenticated])
def update_rating(request, book_id):
    """
    Update an existing rating for a specific book by the current user.
    """
    role_check = check_users_role(request, role="User")
    if role_check:
        return role_check

    # Debug: Print incoming request data
    print(f"Request data: {request.data}")

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

    # Prepare data for serializer
    data = request.data.copy()  # Ensure we're not modifying the original request data
    data["book"] = book.id
    data["user"] = request.user.id

    partial = request.method == "PATCH"

    # Debug: Print final data being sent to serializer
    print(f"Data being sent to serializer: {data}")

    # Serialize and update the rating
    serializer = RatingSerializer(rating, data=data, partial=partial)

    if serializer.is_valid():
        print(f"Serialized data is valid: {serializer.validated_data}")
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        # Debug: Print serializer errors
        print(f"Serializer errors: {serializer.errors}")
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def average_rating(request, book_id):
    try:
        # Fetch the book
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Calculate average rating
        avg_rating = Rating.objects.filter(book=book).aggregate(Avg("score"))[
            "score__avg"
        ]

        # Handle the case where there are no ratings
        if avg_rating is None:
            avg_rating = 0  # Return 0 if no ratings are available
    except Exception as e:
        # If there's any error in the aggregation or other database operations
        return Response(
            {"error": f"An error occurred while fetching the average rating: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"average_rating": avg_rating}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_rating_for_book(request, book_id):
    """
    Fetch the rating a specific user has given to a particular book.
    """
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        rating = Rating.objects.get(book=book, user=request.user)
    except Rating.DoesNotExist:
        return Response(
            {"error": "You have not rated this book."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Use the refined serializer to return only the required data
    serializer = UserRatingSerializer(rating)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def top_rated_books(request):
    try:

        top_rated = 10

        books = Book.objects.all()
        books_with_ratings = []


        for book in books:
 
            ratings = Rating.objects.filter(book=book)
            
            if ratings.exists():

                total_score = sum([rating.score for rating in ratings])
                avg_rating = total_score / len(ratings)
                books_with_ratings.append({
                    'book': book,
                    'avg_rating': avg_rating,
                    'rating_count': len(ratings)
                })
        
        sorted_books = sorted(books_with_ratings, key=lambda x: x['avg_rating'], reverse=True)

        top_books = sorted_books[:top_rated]


        top_books_data = []
        for book in top_books:
            book_data = BookSerializer(book['book']).data
            book_data['avg_rating'] = book['avg_rating']
            book_data['rating_count'] = book['rating_count']
            top_books_data.append(book_data)

        return Response(top_books_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def top_rated_authors(request):
    try:
        top_authors_count = 10  # Number of top-rated authors to return
        books = Book.objects.all()

        # Dictionary to store cumulative scores and counts for each author
        author_ratings = {}

        # Iterate through all books to calculate ratings
        for book in books:
            ratings = Rating.objects.filter(book=book)
            
            if ratings.exists():
                total_score = sum([rating.score for rating in ratings])
                avg_rating = total_score / len(ratings)

                if book.author not in author_ratings:
                    # Initialize author data
                    author_ratings[book.author] = {
                        "total_score": 0,
                        "rating_count": 0,
                        "books_count": 0,
                    }

                # Update cumulative scores and counts for the author
                author_ratings[book.author]["total_score"] += total_score
                author_ratings[book.author]["rating_count"] += len(ratings)
                author_ratings[book.author]["books_count"] += 1

        # Calculate average rating for each author
        authors_with_avg_rating = [
            {
                "author": author,
                "avg_rating": data["total_score"] / data["rating_count"],
                "rating_count": data["rating_count"],
                "books_count": data["books_count"],
            }
            for author, data in author_ratings.items()
        ]

        # Sort authors by average rating in descending order
        sorted_authors = sorted(authors_with_avg_rating, key=lambda x: x["avg_rating"], reverse=True)

        # Select top-rated authors
        top_authors = sorted_authors[:top_authors_count]

        return Response(top_authors, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
