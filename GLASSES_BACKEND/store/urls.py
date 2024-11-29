from django.urls import path
from .views import *

urlpatterns = [path("search/", BookSearch.as_view(), name="search")]
