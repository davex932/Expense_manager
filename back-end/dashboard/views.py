from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from expense_management.models import Expense
from django.utils import timezone

# Create your views here.
@api_view(['GET'])
def dashboard(request):
    user= request.user
    expenses_total= Expense.objects.filter(user= user)
    total= sum(expense.amount for expense in expenses_total)

    expenses_count= Expense.objects.filter(user= user)
    total_count= expenses_count.count()

    expenses_total_month= Expense.objects.filter(user= user, date__month= timezone.now().month, date__year= timezone.now().year)
    total_expenses_month= sum(expense.amount for expense in expenses_total_month)

    return Response({
        'total_expenses': total,
        'total_expenses_count': total_count,
        'total_expenses_current_month': total_expenses_month
    }, status= status.HTTP_200_OK)