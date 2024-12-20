from django.urls import path
from .views import (
    AddToCartView,
    CartView,
    UpdateQuantityView,
    RemoveFromCartView,
    ClearCartView,
    CalculateTotalView,
)

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("add/", AddToCartView.as_view(), name="add_to_cart"),
    path(
        "update/<int:item_id>/",
        UpdateQuantityView.as_view(),
        name="update_quantity",
    ),
    path(
        "remove/<int:item_id>/",
        RemoveFromCartView.as_view(),
        name="remove_from_cart",
    ),
    path("clear/", ClearCartView.as_view(), name="clear_cart"),  # Clear cart view
    path("total/", CalculateTotalView.as_view(), name="calculate_total"),
    # path("csrf/", csrf, name="csrf"),
]
