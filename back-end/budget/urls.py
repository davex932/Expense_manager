from django.urls import path
from .views import budget_list

urlpatterns= [
    path('', budget_list, name= 'budget_list'),
]