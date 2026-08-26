from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import logging

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from finance import settings
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)

# Create your views here.

def get_tokens_for_user(user):
    refresh= RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    id_token_str = (
        request.data.get('id_tokens') or 
        request.data.get('id_token') or 
        request.query_params.get('id_tokens') or 
        request.query_params.get('id_token')
    )
    
    logger.info(f"Google login attempt - Token received: {id_token_str[:50] if id_token_str else 'None'}...")
    logger.info(f"GOOGLE_CLIENT_ID configured: {settings.GOOGLE_CLIENT_ID}")

    if not id_token_str:
        logger.warning("Missing id_token in request")
        return Response({'error': 'id_token manquant'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verifie les token aupres de Google et extrait les infos du user
        google_info = id_token.verify_oauth2_token(
            id_token_str,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        logger.info(f"Token verified successfully for email: {google_info.get('email')}")
    except ValueError as e:
        logger.error(f"Token verification failed: {str(e)}")
        return Response({'error': 'Token Google invalide ou expiré', 'details': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {str(e)}")
        return Response({'error': 'Erreur serveur lors de la vérification du token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    email = google_info.get('email')
    first_name = google_info.get('given_name', '')
    last_name = google_info.get('family_name', '')

    if not email:
        logger.warning("No email provided by Google")
        return Response({'error': 'Email non fourni par Google'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.filter(email=email).first()
    if not user:
        raw_username = (first_name + last_name).strip() or email.split('@')[0]
        username = raw_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{raw_username}_{counter}"
            counter += 1
        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
    logger.info(f"User retrieved/created: {user.username}")

    tokens = get_tokens_for_user(user)

    return Response({
        **tokens,
        'user': {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
    }, status=status.HTTP_200_OK)
