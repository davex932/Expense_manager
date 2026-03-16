from rest_framework import serializers
from .models import Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):

    user= serializers.PrimaryKeyRelatedField(queryset= User.objects.all())#ceci est utilise pour demande seulement l'id du user et pas tous ses details
    class Meta:
        model= Category
        fields= ['id','name','color','user']