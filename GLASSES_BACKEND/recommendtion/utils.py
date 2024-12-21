import numpy as np
import joblib
from store.models import Book, Category
from django.contrib.auth.models import User
from collections import Counter
from favouritelist.models import FavoriteList

model_path = "ML_models/knn_model_trained_3.pkl"  
knn = joblib.load(model_path)

def get_user_favorite_categories(user):
    favorite_list = getattr(user, 'favorite_list', None)
    if not favorite_list:
        return []

    favorite_books = favorite_list.items.values_list("book", flat=True)
    if not favorite_books.exists():
        return []

    favorite_categories = Category.objects.filter(books__id__in=favorite_books).distinct()
    category_names = [category.name for category in favorite_categories]
    category_count = Counter(category_names)

    return category_count.most_common()

def recommend_books_for_user(user, top_n=10):

    favorite_list, _ = FavoriteList.objects.get_or_create(user=user)

    favorite_books = favorite_list.items.values_list("book", flat=True)
    if not favorite_books.exists():
        return []

    favorite_categories = get_user_favorite_categories(user)
    if not favorite_categories:
        return []

    all_categories = list(Category.objects.all())
    category_mapping = {category.name: idx for idx, category in enumerate(all_categories)}
    num_categories = len(all_categories)

    user_category_vector = np.zeros(num_categories)
    for category_name, _ in favorite_categories:
        if category_name in category_mapping:
            category_id = category_mapping[category_name]
            user_category_vector[category_id] = 1

    
    user_category_vector = user_category_vector.reshape(1, -1)

    n_neighbors = min(knn.n_samples_fit_, len(User.objects.all()))


    distances, indices = knn.kneighbors(user_category_vector, n_neighbors=n_neighbors)
    similar_user_ids = [user.id for user in User.objects.filter(id__in=indices.flatten())]

    recommended_books = (
        Book.objects.exclude(id__in=favorite_books)
        .filter(categories__id__in=[category_mapping[categ] for categ, _ in favorite_categories])
        .distinct()[:top_n]
    )

    return list(recommended_books)
