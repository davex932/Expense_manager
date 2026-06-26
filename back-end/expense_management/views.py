from django.shortcuts import render
from .serializers import ExpenseSerializer
from .models import Expense
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.postgres.search import SearchVector

# Create your views here.

@api_view(['POST','GET'])
def expense_list(request):
    if request.method == 'GET':
        category= request.query_params.get('category')
        search= request.query_params.get('search')
        user= request.user
        expenses= Expense.objects.filter(user= user)
        if category:
            expenses= expenses.filter(category_id=category)
        if search:
            expenses= expenses.annotate(
                search=SearchVector('description'),
            ).filter(search= search)
        expenses_serialized= ExpenseSerializer(expenses, many= True)
        return Response(expenses_serialized.data, status= status.HTTP_200_OK)
    elif request.method == 'POST':
        user= request.user
        expense= request.data
        expense['user']= user.id
        expense_serialized= ExpenseSerializer(data= expense)
        if expense_serialized.is_valid():
            expense_serialized.save()
            return Response(expense_serialized.data, status= status.HTTP_201_CREATED)
        return Response(expense_serialized.errors, status= status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE','PATCH'])
def expense_detail(request, pk):
    try:
        expense= Expense.objects.get(pk= pk)
    except Expense.DoesNotExist as e:
        return Response({'error': str(e)}, status= status.HTTP_404_NOT_FOUND)
    
    if request.method== 'PATCH':
        expense_serialized= ExpenseSerializer(expense, data= request.data, partial= True)
        if expense_serialized.is_valid():
            expense_serialized.save()
            return Response(expense_serialized.data, status= status.HTTP_200_OK)
        return Response(expense_serialized.errors, status= status.HTTP_400_BAD_REQUEST)
    elif request.method== 'DELETE':
        expense.delete()
        return Response(status= status.HTTP_204_NO_CONTENT)