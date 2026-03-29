from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Budget
from categories.models import Category
from expense_management.models import Expense

class BudgetSerializer(serializers.ModelSerializer):
    category_color= serializers.CharField(source= 'category.color', read_only= True)
    category_name= serializers.CharField(source= 'category.name', read_only= True)
    expense_total= serializers.SerializerMethodField()
    percentage_used= serializers.SerializerMethodField()

    class Meta:
        model= Budget
        fields= ['id', 'amount', 'user', 'month', 'year', 'category', 'category_color', 'category_name', 'expense_total', 'percentage_used']

    def get_expense_total(self, obj):
        expenses= Expense.objects.filter(user= obj.user, date__month= obj.month, date__year= obj.year, category= obj.category)
        total= sum(expense.amount for expense in expenses)
        return total

    def get_percentage_used(self, obj):
        expense_total= self.get_expense_total(obj)
        if obj.amount == 0:
            return 0
        return (expense_total / obj.amount) * 100