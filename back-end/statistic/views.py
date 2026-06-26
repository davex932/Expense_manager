from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from expense_management.models import Expense
from django.utils import timezone
import calendar
from decimal import Decimal
from .serializers import StatisticExpenseCategorySerializer, StatisticExpenseSerializer
from datetime import datetime, timedelta

# Create your views here.
@api_view(['GET'])
def statistics_expenses(request):
    month= int(request.query_params.get('month'))
    year= int(request.query_params.get('year'))
    user= request.user
    expenses= Expense.objects.filter(user= user, date__month= month, date__year= year)
    expenses_last_month= Expense.objects.filter(user= user, date__month= month-1 if month > 1 else 12, date__year= year if month > 1 else year-1)

    total_expenses= sum(expense.amount for expense in expenses)
    total_expenses_last_month= sum(expense.amount for expense in expenses_last_month)
    percentage_change= ((total_expenses- total_expenses_last_month)/ total_expenses)*100 if total_expenses > 0 else 0

    expenses_count= expenses.count()
    expenses_count_last_month= expenses_last_month.count()
    percentage_change_count=((expenses_count- expenses_count_last_month)/ expenses_count)*100 if expenses_count > 0 else 0
    statut_count= "En hausse" if percentage_change_count>0 else "En chute"

    expense_max= expenses.order_by('-amount').first()
    expense_max_last_month= expenses_last_month.order_by('-amount').first()
    percentage_change_max= ((expense_max.amount- expense_max_last_month.amount)/ expense_max.amount)*100 if expense_max_last_month and expense_max.amount > 0 else 0
    statut_max= "En hausse" if percentage_change_max>0 else "En chute"
    
    expenses_daily= {}
    num_days = calendar.monthrange(year, month)[1]
    for i in range(1, num_days + 1):
         expenses_daily[f'day_{i}']= expenses.filter(date__day= i)
    total_daily = sum((expense.amount for expense in expenses), Decimal(0))
    moyenne_daily = total_daily / num_days if num_days > 0 else Decimal(0)

    expenses_daily_last_month= {}
    last_month = month - 1 if month > 1 else 12
    last_year = year if month > 1 else year - 1
    num_days_last = calendar.monthrange(last_year, last_month)[1]
    for i in range(1, num_days_last + 1):
         expenses_daily_last_month[f'day_{i}']= expenses_last_month.filter(date__day= i)
    total_daily_last_month = sum((expense.amount for expense in expenses_last_month), Decimal(0))
    moyenne_daily_last_month = total_daily_last_month / num_days_last if num_days_last > 0 else Decimal(0)
    percentage_change_moyenne_daily= ((moyenne_daily- moyenne_daily_last_month)/ moyenne_daily)*100 if moyenne_daily > 0 else 0
    return Response({
      'total_expenses': total_expenses,
      'percentage_change': percentage_change,
      'expenses_count': expenses_count,
      'statut_count': statut_count,
      'expense_max': expense_max.amount if expense_max else None,
      'statut_max': statut_max,
      'mean_daily': moyenne_daily,
      'percentage_change_moyenne_daily': percentage_change_moyenne_daily 
    }, status= status.HTTP_200_OK)

@api_view(['GET'])
def statistics_categories_expenses(request):
     user= request.user
     month= request.query_params.get('month')
     year=  request.query_params.get('year')
     expenses= Expense.objects.filter(user= user, date__month= month, date__year= year).distinct('category')
     expenses_serialized= StatisticExpenseCategorySerializer(expenses, many= True)
     return Response(expenses_serialized.data, status= status.HTTP_200_OK)

@api_view(['GET'])
def statistic_expense(request):
     user= request.user
     month= request.query_params.get('month')
     year= request.query_params.get('year')
     expenses= Expense.objects.filter(user= user, date__month= month, date__year= year).order_by('-amount')[:6]
     expenses_serialized= StatisticExpenseSerializer(expenses, many= True)
     return Response(expenses_serialized.data, status= status.HTTP_200_OK)

@api_view(['GET'])
def statistic_expenses_daily(request):
     aujourdhui = datetime.now().day
    
     liste_jours = list(range(1, aujourdhui + 1))
     
     month= request.query_params.get('month')
     year= request.query_params.get('year')
     user= request.user
     expenses={}
     for i in liste_jours:
          daily_expenses = Expense.objects.filter(user=user, date__month=month, date__year=year, date__day=i)
          expenses[f'day_{i}'] = sum(expense.amount for expense in daily_expenses) if daily_expenses.exists() else Decimal(0)  

     return Response(expenses, status= status.HTTP_200_OK)