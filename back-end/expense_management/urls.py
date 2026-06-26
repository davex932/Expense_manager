from django.urls import path
from .views import expense_list, expense_detail

urlpatterns= [
    path('<int:pk>/', expense_detail, name= 'expense_detail'),
    path('', expense_list, name= 'expense_list'),
]