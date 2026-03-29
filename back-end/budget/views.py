from django.shortcuts import render
from .serializers import BudgetSerializer
from .models import Budget
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

@api_view(['GET', 'POST'])
def budget_list(request):
    if request.method == 'POST':
        user= request.user
        budget= request.data
        budget['user']= user.id
        budget_serialized= BudgetSerializer(data= budget)
        if budget_serialized.is_valid():
            budget_serialized.save()
            return Response(budget_serialized.data, status= status.HTTP_201_CREATED)
        return Response(budget_serialized.errors, status= status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        month= request.query_params.get('month')
        year= request.query_params.get('year')
        user= request.user
        budgets= Budget.objects.filter(user= user, month= month, year= year)
        budgets_serialized= BudgetSerializer(budgets, many= True)
        return Response(budgets_serialized.data, status= status.HTTP_200_OK)