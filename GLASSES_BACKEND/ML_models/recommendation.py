import numpy as np
import pandas as pd
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Embedding, Input, Flatten, Dense, Concatenate
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split

def get_user_favorite_books(user_id, rating_df, threshold=2):
    # Get ratings of the specific user
    user_ratings = rating_df[rating_df['user_id'] == user_id]
    # Filter the books rated above the threshold
    favorite_books = user_ratings[user_ratings['score'] >= threshold]
    return favorite_books

def get_top_rated_books(rating_df, top_n=5):
    # Get the top-rated books based on average score
    top_rated_books = rating_df.groupby('book_id')['score'].mean().sort_values(ascending=False).head(top_n)
    return top_rated_books

def create_model(num_books, num_categories, embedding_dim=50):
    # Define inputs for user and book categories
    user_input = Input(shape=(1,), name="user_input")  # User ID
    book_input = Input(shape=(1,), name="book_input")  # Book ID
    category_input = Input(shape=(num_categories,), name="category_input")  # Book categories

    # Embedding layers for user, book, and category
    user_embedding = Embedding(input_dim=num_books, output_dim=embedding_dim)(user_input)
    book_embedding = Embedding(input_dim=num_books, output_dim=embedding_dim)(book_input)

    # Flatten the embeddings
    user_flattened = Flatten()(user_embedding)
    book_flattened = Flatten()(book_embedding)

    # Concatenate user, book, and category embeddings
    concatenated = Concatenate()([user_flattened, book_flattened, category_input])

    # Add fully connected layers
    dense_1 = Dense(128, activation='relu')(concatenated)
    dense_2 = Dense(64, activation='relu')(dense_1)
    output = Dense(1, activation='sigmoid')(dense_2)  # Output is a probability (0 to 1)

    # Create the model using the functional API
    model = Model(inputs=[user_input, book_input, category_input], outputs=output)

    model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])
    
    return model

def recommend_books(user_id, book_df, rating_df, num_categories, num_books, embedding_dim=50, threshold=2):
    # Subtract 1 from user_id and book_id to make indices start from 0
    user_id -= 1

    # Get user favorite books based on ratings
    favorite_books = get_user_favorite_books(user_id, rating_df, threshold)
    
    # Get top-rated books based on average ratings
    top_rated_books = get_top_rated_books(rating_df)

    # Prepare the data for training
    all_books = book_df[['book_id', 'categories']]
    
    X_user = []
    X_book = []
    X_category = []
    y = []

    # Prepare the training data
    for _, row in favorite_books.iterrows():
        for book_id in all_books['book_id'].tolist():
            X_user.append(user_id)
            X_book.append(book_id - 1)  # Adjust book_id by subtracting 1
            categories = all_books[all_books['book_id'] == book_id]['categories'].values[0]
            category_vector = [1 if category in categories else 0 for category in range(num_categories)]
            X_category.append(category_vector)
            # We mark the books the user has rated above the threshold as "liked" (1)
            y.append(1 if row['book_id'] == book_id else 0)

    # Convert to numpy arrays
    X_user = np.array(X_user)
    X_book = np.array(X_book)
    X_category = np.array(X_category)
    y = np.array(y)

    # Split data into training and testing sets
    X_user_train, X_user_test, X_book_train, X_book_test, X_category_train, X_category_test, y_train, y_test = train_test_split(
        X_user, X_book, X_category, y, test_size=0.2, train_size=0.8, shuffle=True
    )

    # Create and train the model
    model = create_model(num_books, num_categories, embedding_dim)
    model.fit([X_user_train, X_book_train, X_category_train], y_train, epochs=10, batch_size=64, validation_data=([X_user_test, X_book_test, X_category_test], y_test))

    # Generate book recommendations for the user
    recommended_books = []
    for book_id in all_books['book_id']:
        categories = all_books[all_books['book_id'] == book_id]['categories'].values[0]
        category_vector = [1 if category in categories else 0 for category in range(num_categories)]
        
        # Ensure inputs are shaped properly for the model prediction
        prediction = model.predict([np.array([user_id]), np.array([book_id - 1]), np.array([category_vector])])

        if prediction > 0.5:  # If the predicted probability is greater than 0.5, recommend the book
            recommended_books.append(book_id)

    # Return recommended books from the book dataframe
    recommended_books_df = book_df[book_df['book_id'].isin(recommended_books)]
    return recommended_books_df