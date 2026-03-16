from django.shortcuts import render
from .serializers import CategorySerializer
from .models import Category
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['POST','GET'])
def category_list(request):
    if request.method == 'GET':
        user= request.user
        categories= Category.objects.filter(user= user)
        categories_serialized= CategorySerializer(categories, many= True)
        return Response(categories_serialized.data, status= status.HTTP_200_OK)
    elif request.method == 'POST':
        user= request.user
        category= request.data
        category['user']= user.id
        category_serialized= CategorySerializer(data= category)
        if category_serialized.is_valid():
            category_serialized.save()
            return Response(category_serialized.data, status= status.HTTP_201_CREATED)
        return Response(category_serialized.errors, status= status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET','DELETE','PATCH'])
def category_detail(request, pk):
    try:
        category= Category.objects.get(pk= pk)
    except Category.DoesNotExist as e:
        return Response({'error': str(e)}, status= status.HTTP_404_NOT_FOUND)
    
    if request.method== 'GET':
        category_serialized= CategorySerializer(category)
        return Response(category_serialized.data, status= status.HTTP_200_OK)
    elif request.method== 'PATCH':
        category_serialized= CategorySerializer(category, data= request.data, partial= True)
        if category_serialized.is_valid():
            category_serialized.save()
            return Response(category_serialized.data, status= status.HTTP_200_OK)
        return Response(category_serialized.errors, status= status.HTTP_400_BAD_REQUEST)
    elif request.method== 'DELETE':
        category.delete()
        return Response(status= status.HTTP_204_NO_CONTENT)