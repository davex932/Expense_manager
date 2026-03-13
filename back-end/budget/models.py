from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Budget(models.Model):
    amount= models.DecimalField(max_digits=10, decimal_places= 2)
    month= models.IntegerField()
    year= models.IntegerField()
    user= models.ForeignKey(User, on_delete= models.CASCADE)
    created_at= models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year}"