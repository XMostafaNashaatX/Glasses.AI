from django.urls import path
from .views import *

urlpatterns = [
    path("search/", BookSearch.as_view(), name="search"),
    path("Add/order/", Add_Order.as_view(), name="add_order"),
    path("cancel/order/", Cancel_Order.as_view(), name="cancel_order"),
    path("update/order/", Update_order.as_view(), name="update_order"),
    path("books/all/", AllBooks.as_view(), name="all-books"),
    path("books/<int:book_id>/", BookDetail.as_view(), name="book-detail"),
]
