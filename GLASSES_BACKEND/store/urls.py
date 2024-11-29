from django.urls import path
from .views import *

urlpatterns = [
    path('search/' , BookSearch.as_view() , name = 'search') ,
    path('Add/order/' , Add_Order.as_view() , name = 'add_order') , 
    path('cancel/order/' , Cancel_Order.as_view() , name = 'cancel_order') ,
    path('update/order/' , Update_order.as_view() , name = 'update_order') ,
]

