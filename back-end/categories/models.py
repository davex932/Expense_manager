from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    name= models.CharField(max_length= 100)
    color= models.CharField(max_length= 7, default='noir')
    user= models.ForeignKey(User, on_delete= models.CASCADE)
    created_at= models.DateTimeField(auto_now_add= True)
    
    def __str__(self):
        return self.name