from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_payment, name="create_payment"),
    path("execute/", views.execute_payment, name="execute_payment"),
    path("cancel/", views.cancel_payment, name="cancel_payment"),
    path("create_visa/", views.create_visa_payment, name="create_visa_payment"),  # Visa
    path(
        "execute_visa/", views.execute_visa_payment, name="execute_visa_payment"
    ),  # Visa
]
