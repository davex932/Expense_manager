#!/usr/bin/env bash
# Script de build pour Render

set -o errexit  # Arrêter en cas d'erreur

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
