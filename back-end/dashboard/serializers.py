from rest_framework import serializers
from expense_management.models import Expense
from categories.models import Category
from django.contrib.auth.models import User

class StatisticExpenseCategorySerializer(serializers.ModelSerializer):

    Expense_by_category= serializers.SerializerMethodField()
    class Meta:
        model= Category
        fields= ['id', 'name', 'color', 'Expense_by_category']

    def get_Expense_by_category(self, obj):
        user= self.context['request'].user
        Expenses= Expense.objects.filter(user= user, category= obj.id)
        total= sum(expense.amount for expense in Expenses)
        return total
