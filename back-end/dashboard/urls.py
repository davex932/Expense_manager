from django.urls import path
from .views import dashboard, dashboard_expenses_by_category

urlpatterns= [
    path('', dashboard, name= 'dashboard'), 
    path('expenses-by-category/', dashboard_expenses_by_category, name= 'dashboard_expenses_by_category')
]