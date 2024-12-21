import numpy as np
import pandas as pd
from tensorflow.keras.utils import to_categorical

def to_categories(y, num_classes):
    # Assuming y is a list of categories (each book can have multiple categories)
    # Create a mapping from category name to an index (integer)
    
    # Get all unique categories across the dataset
    unique_categories = set([categ for sublist in y for categ in sublist])  # Flatten and get unique categories
    
    # Create a mapping of category names to integer indices
    category_map = {categ: i for i, categ in enumerate(unique_categories)} 
    
    # Now, convert categories to integers based on the category_map
    y_int = [[category_map[categ] for categ in categories] for categories in y]
    
    # Expand dimensions to ensure correct shape for to_categorical
    y_int_expanded = [np.expand_dims(categs, axis=1) for categs in y_int]
    
    # Flatten the list to a 1D array and apply to_categorical
    flat_y_int = np.concatenate([categs.flatten() for categs in y_int_expanded], axis=0)
    
    # Apply one-hot encoding using to_categorical
    return to_categorical(flat_y_int, num_classes=num_classes)