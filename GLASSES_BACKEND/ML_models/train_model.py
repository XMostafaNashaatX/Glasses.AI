import numpy as np
import pandas as pd
import joblib
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import accuracy_score
from collections import Counter
import os
import sys
import django


project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'GLASSES_BACKEND'))
sys.path.append(project_root) 
os.environ['DJANGO_SETTINGS_MODULE'] = 'GLASSES_BACKEND.settings' 
django.setup()  


from store.models import Book, Category
from ratings.models import Rating


def Create_dataset():
    books = Book.objects.all()
    ratings = Rating.objects.all()

    all_categories = Category.objects.all()
    category_mapping = {cat.id: Categ_id for Categ_id, cat in enumerate(all_categories)}

    book_data = []
    rating_data = []
    user_category_data = {}

    for book in books:
        categories = [category_mapping[category.id] for category in book.categories.all()]
        book_data.append({
            "book_id": book.id,
            "categories": categories,
        })

    for rating in ratings:
        rating_data.append({
            "user_id": rating.user.id,
            "book_id": rating.book.id,
        })
        if rating.user.id not in user_category_data:
            user_category_data[rating.user.id] = set()

        for category in rating.book.categories.all():
            user_category_data[rating.user.id].add(category_mapping[category.id])


    for i, user_id in enumerate(user_category_data.keys()):
        print(f"User {user_id}: {user_category_data[user_id]}")


    num_categories = len(all_categories)
    book_df = pd.DataFrame(book_data)
    book_df['multi_hot_categories'] = book_df['categories'].apply(
        lambda cats: [1 if categs_id in cats else 0 for categs_id in range(num_categories)]
    )


    rating_df = pd.DataFrame(rating_data)

    print(rating_df.head())
    print(book_df[['book_id', 'categories', 'multi_hot_categories']].head())

    user_category_matrix = np.zeros((len(user_category_data), num_categories))
    user_ids = sorted(user_category_data.keys())
    for i, user_id in enumerate(user_ids):
        for category_id in user_category_data[user_id]:
            if category_id < num_categories:  
                user_category_matrix[i, category_id] = 1

    return book_df, rating_df, num_categories, user_category_matrix, user_ids


book_df, rating_df, num_categories, user_category_matrix, user_ids = Create_dataset()

print(len(book_df))

if np.all(user_category_matrix == 0):
    raise ValueError("User Category Matrix is empty. Ensure users have rated books.")


knn = NearestNeighbors(n_neighbors=10, metric='cosine') 
knn.fit(user_category_matrix)


#model_save_path = os.path.join(project_root, 'ML_models/knn_model_trained_3.pkl')
#joblib.dump(knn, model_save_path)

#print(f"KNN model saved at: {model_save_path}")


def recommend_books_for_user(user_id, top_n=5):

    if user_id not in user_ids:
        raise ValueError(f"User ID {user_id} not found in the dataset.")


    user_index = user_ids.index(user_id)
    user_vector = user_category_matrix[user_index].reshape(1, -1)

    distances, indices = knn.kneighbors(user_vector, n_neighbors=min(top_n, len(user_ids)))

    similar_user_ids = [user_ids[user_id] for user_id in indices.flatten()]
    recommended_books = set()
    for similar_user_id in similar_user_ids:
        similar_user_ratings = rating_df[rating_df['user_id'] == similar_user_id]['book_id'].tolist()
        recommended_books.update(similar_user_ratings)

    user_rated_books = rating_df[rating_df['user_id'] == user_id]['book_id'].tolist()
    final_recommendations = [book for book in recommended_books if book not in user_rated_books]

    return final_recommendations[:top_n]


user_id_to_recommend = 15  
try:
    recommendations = recommend_books_for_user(user_id_to_recommend)
    print(f"Recommended books for User {user_id_to_recommend}: {recommendations}")

except ValueError as e:
    print(e)
