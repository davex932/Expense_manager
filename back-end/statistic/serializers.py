from rest_framework import serializers
from expense_management.models import Expense
from categories.models import Category
from django.contrib.auth.models import User

class StatisticExpenseCategorySerializer(serializers.ModelSerializer):

    category_color= serializers.CharField(source= 'category.color', read_only= True)
    category_name= serializers.CharField(source= 'category.name', read_only= True)
    expense_by_category= serializers.SerializerMethodField()
    class Meta:
        model= Expense
        fields= ['user', 'date', 'category', 'category_color', 'category_name','expense_by_category']

    def get_expense_by_category(self, obj):
        expenses= Expense.objects.filter(user= obj.user, date__month= obj.date.month, date__year= obj.date.year, category= obj.category)
        total= sum(expense.amount for expense in expenses)
        return total
    
class StatisticExpenseSerializer(serializers.ModelSerializer):

    category_color= serializers.CharField(source= 'category.color', read_only= True)
    class Meta:
        model= Expense
        fields= ['user', 'amount', 'description', 'date', 'category', 'category_color']

    


