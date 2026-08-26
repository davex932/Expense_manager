from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from expense_management.models import Expense
from django.utils import timezone
import calendar
from decimal import Decimal
from .serializers import StatisticExpenseCategorySerializer, StatisticExpenseSerializer

def get_month_year(request):
    try:
        month = int(request.query_params.get('month'))
    except (TypeError, ValueError):
        month = timezone.now().month
        
    try:
        year = int(request.query_params.get('year'))
    except (TypeError, ValueError):
        year = timezone.now().year
        
    return month, year

@api_view(['GET'])
def statistics_expenses(request):
    month, year = get_month_year(request)
    user = request.user
    expenses = Expense.objects.filter(user=user, date__month=month, date__year=year)
    
    last_month = month - 1 if month > 1 else 12
    last_year = year if month > 1 else year - 1
    expenses_last_month = Expense.objects.filter(user=user, date__month=last_month, date__year=last_year)

    total_expenses = sum((expense.amount for expense in expenses), Decimal(0))
    total_expenses_last_month = sum((expense.amount for expense in expenses_last_month), Decimal(0))
    percentage_change = ((total_expenses - total_expenses_last_month) / total_expenses) * 100 if total_expenses > 0 else 0

    expenses_count = expenses.count()
    expenses_count_last_month = expenses_last_month.count()
    percentage_change_count = ((expenses_count - expenses_count_last_month) / expenses_count) * 100 if expenses_count > 0 else 0
    statut_count = "En hausse" if percentage_change_count > 0 else "En chute"

    expense_max = expenses.order_by('-amount').first()
    expense_max_last_month = expenses_last_month.order_by('-amount').first()
    
    max_amount = expense_max.amount if expense_max else Decimal(0)
    max_amount_last_month = expense_max_last_month.amount if expense_max_last_month else Decimal(0)
    
    if max_amount > 0:
        percentage_change_max = ((max_amount - max_amount_last_month) / max_amount) * 100
    else:
        percentage_change_max = 0
        
    statut_max = "En hausse" if percentage_change_max > 0 else "En chute"
    
    num_days = calendar.monthrange(year, month)[1]
    moyenne_daily = total_expenses / num_days if num_days > 0 else Decimal(0)

    num_days_last = calendar.monthrange(last_year, last_month)[1]
    moyenne_daily_last_month = total_expenses_last_month / num_days_last if num_days_last > 0 else Decimal(0)
    percentage_change_moyenne_daily = ((moyenne_daily - moyenne_daily_last_month) / moyenne_daily) * 100 if moyenne_daily > 0 else 0

    return Response({
      'total_expenses': total_expenses,
      'percentage_change': percentage_change,
      'expenses_count': expenses_count,
      'statut_count': statut_count,
      'expense_max': max_amount if expense_max else None,
      'statut_max': statut_max,
      'mean_daily': moyenne_daily,
      'percentage_change_moyenne_daily': percentage_change_moyenne_daily 
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def statistics_categories_expenses(request):
    month, year = get_month_year(request)
    user = request.user
    expenses_qs = Expense.objects.filter(user=user, date__month=month, date__year=year).select_related('category')
    
    category_seen = set()
    expenses = []
    for expense in expenses_qs:
        if expense.category_id not in category_seen:
            category_seen.add(expense.category_id)
            expenses.append(expense)

    expenses_serialized = StatisticExpenseCategorySerializer(expenses, many=True)
    return Response(expenses_serialized.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def statistic_expense(request):
    month, year = get_month_year(request)
    user = request.user
    expenses = Expense.objects.filter(user=user, date__month=month, date__year=year).order_by('-amount')[:6]
    expenses_serialized = StatisticExpenseSerializer(expenses, many=True)
    return Response(expenses_serialized.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def statistic_expenses_daily(request):
    month, year = get_month_year(request)
    user = request.user
    num_days = calendar.monthrange(year, month)[1]
    
    daily_expenses_qs = list(Expense.objects.filter(user=user, date__month=month, date__year=year))
    
    expenses = {}
    for i in range(1, num_days + 1):
        expenses[f'day_{i}'] = sum((expense.amount for expense in daily_expenses_qs if expense.date.day == i), Decimal(0))

    return Response(expenses, status=status.HTTP_200_OK)