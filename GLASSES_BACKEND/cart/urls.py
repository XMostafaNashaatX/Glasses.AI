from django.urls import path
from .views import CartView, AddToCartView, UpdateQuantityView, RemoveFromCartView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("cart/", CartView.as_view(), name="get_cart"),
    path("add/", AddToCartView.as_view(), name="add_to_cart"),
    path("update/", UpdateQuantityView.as_view(), name="update_quantity"),
    path("remove/", RemoveFromCartView.as_view(), name="remove_from_cart"),
]
