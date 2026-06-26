from rest_framework import serializers
from .models import Expense
from categories.models import Category
from django.contrib.auth.models import User

class ExpenseSerializer(serializers.ModelSerializer):

    category_color= serializers.CharField(source= 'category.color', read_only= True)
    category_name= serializers.CharField(source= 'category.name', read_only= True)
    class Meta:
        model= Expense
        fields= ['id', 'amount', 'description', 'user', 'date', 'category', 'category_color', 'category_name']