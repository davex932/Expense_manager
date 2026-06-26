from django.urls import path
from .views import statistics_expenses, statistics_categories_expenses, statistic_expense, statistic_expenses_daily

urlpatterns= [
    path('expenses/', statistics_expenses, name= 'statistic'),
    path('categories/', statistics_categories_expenses, name= 'categories_expenses'), 
    path('expenses-ranking/', statistic_expense, name= 'expenses_ranking'),
    path('expenses-daily/', statistic_expenses_daily, name= 'expenses_daily')
]