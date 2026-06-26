from rest_framework import serializers
from .models import Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):

    #user= serializers.PrimaryKeyRelatedField(queryset= User.objects.all())ceci est utilise pour demande seulement l'id du user et pas tous ses details, deplus il est utilile orsqu'on souhaite personnalise la representation du user dans la reponse de l'api, mais dans notre cas on n'a pas besoin de personnaliser la representation du user dans la reponse de l'api, donc on peut se passer de cette ligne et laisser le serializer generer automatiquement le champ user qui sera un PrimaryKeyRelatedField
    class Meta:
        model= Category
        fields= ['id','name','color','user']