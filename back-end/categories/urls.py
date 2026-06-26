from django.urls import path
from .views import category_list, category_detail

urlpatterns= [
    path('<int:pk>/', category_detail, name= 'category_detail'),
    path('', category_list, name= 'category_list'),
]