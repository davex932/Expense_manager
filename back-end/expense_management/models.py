from django.db import models
from django.contrib.auth.models import User
from categories.models import Category

# Create your models here.
class Expense(models.Model):
    amount= models.DecimalField(max_digits=10, decimal_places=2)
    description= models.TextField(blank= True)
    date= models.DateField()
    user= models.ForeignKey(User, on_delete= models.CASCADE)
    category= models.ForeignKey(Category, on_delete= models.CASCADE)