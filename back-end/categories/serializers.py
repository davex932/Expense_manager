from rest_framework import serializers
from .models import Category
from django.contrib.auth.models import User
from django.db.models import Sum
from decimal import Decimal
from django.utils import timezone
from budget.models import Budget

class CategorySerializer(serializers.ModelSerializer):
    expense_total = serializers.SerializerMethodField()
    number_transactions = serializers.SerializerMethodField()
    percentage_of_budget = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'user', 'expense_total', 'number_transactions', 'percentage_of_budget']

    def get_expense_total(self, obj):
        total = obj.expense_set.aggregate(total=Sum('amount'))['total']
        return total if total is not None else Decimal('0.00')

    def get_number_transactions(self, obj):
        return obj.expense_set.count()

    def get_percentage_of_budget(self, obj):
        now = timezone.now()
        budget = Budget.objects.filter(category=obj, user=obj.user, month=now.month, year=now.year).first()
        if not budget or budget.amount <= 0:
            return 0
        total = self.get_expense_total(obj)
        return round((float(total) / float(budget.amount)) * 100, 1)
