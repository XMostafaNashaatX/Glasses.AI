import pandas as pd
import numpy as np
from store.models import Book, Category
from ratings.models import Rating

def Create_dataset():
    books = Book.objects.all()
    ratings = Rating.objects.all()

    # Collect all categories
    all_categories = Category.objects.all()
    category_mapping = {cat.id: idx for idx, cat in enumerate(all_categories)}

    book_data = []
    rating_data = []
    user_category_data = {}

    # Iterate over books and prepare the book data
    for book in books:
        if not book.categories.exists():
            continue  # Skip books without categories
        categories = [category_mapping[category.id] for category in book.categories.all()]
        book_data.append({
            "book_id": book.id,
            "categories": categories,
        })

    # Iterate over ratings and prepare rating data
    for rating in ratings:
        rating_data.append({
            "user_id": rating.user.id,
            "book_id": rating.book.id,
        })
        if rating.user.id not in user_category_data:
            user_category_data[rating.user.id] = set()
        # Add the categories of books that the user has rated
        book = rating.book
        for category in book.categories.all():
            user_category_data[rating.user.id].add(category_mapping[category.id])

    # Prepare multi-hot encoded targets for categories
    num_categories = len(all_categories)
    book_df = pd.DataFrame(book_data)
    book_df['multi_hot_categories'] = book_df['categories'].apply(
        lambda cats: [1 if idx in cats else 0 for idx in range(num_categories)]
    )

    # Prepare rating data frame
    rating_df = pd.DataFrame(rating_data)

    # Convert user-category data into a matrix of user preferences
    user_category_matrix = np.zeros((len(user_category_data), num_categories))
    user_ids = sorted(user_category_data.keys())
    for i, user_id in enumerate(user_ids):
        for category_id in user_category_data[user_id]:
            if category_id < num_categories:
                user_category_matrix[i, category_id] = 1

    return book_df, rating_df, num_categories, user_category_matrix, user_ids
