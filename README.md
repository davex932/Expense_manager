# Expense Manager

Application de gestion de dépenses pour suivre les revenus, dépenses, budgets et catégories — back-end en Python (Django) et front-end en JavaScript (Vite + Tailwind). Conçue pour un usage personnel ou par petites équipes.

## Fonctionnalités principales
- Gestion des dépenses (CRUD)
- Catégories de dépenses
- Budgets et suivi des consommations
- Comptes / gestion d'utilisateurs (authentification)
- Dashboard / statistiques et notifications via API

## Stack
- Langages : JavaScript (frontend), Python (backend / Django)
- Back-end : Django (project `finance`) — apps modularisées : authentification, expense_management, categories, budget, user_management, notifications, statistic
- Front-end : Vite + Tailwind CSS (JavaScript), config PostCSS / Tailwind
- API : serializers.py dans les apps => API REST (usage probable de Django REST Framework)

## Arborescence (sélection des éléments top-level)
```text
back-end/                Django project & apps
  manage.py              script d'administration Django
  finance/               Django project (settings, urls, wsgi/asgi)
  authentification/      app d'authentification (views, urls, models, serializers)
  expense_management/    app dépenses (models, serializers, views, urls)
  categories/            app catégories (models, serializers, views, urls)
  budget/                app budgets (models, serializers, views, urls)
  user_management/       app gestion utilisateurs
  notifications/         app notifications
  statistic/             app statistiques
  check_columns.py       utilitaire (vérification de colonnes)
front-end/
  package.json           dépendances & scripts (Vite)
  vite.config.js         config Vite
  tailwind.config.js     config Tailwind
  postcss.config.js
  src/                   code source frontend
  public/                fichiers publics (index, assets)
  .env                   variables d'environnement frontend
```

Comment ça s'articule : le back-end Django expose une API REST (routes dans chaque app, serializers pour transformer les modèles) et le front-end Vite consomme cette API pour l'interface utilisateur (dashboard, formulaires, listes, graphiques). manage.py sert aux migrations, création d'utilisateur, lancement du serveur de développement.

## Installation & exécution (développement)

Prérequis :
- Python 3.8+ et pip
- Node 16+ et npm/yarn
- Base de données (SQLite pour dev, Postgres pour production recommandé)

1) Back-end (Django)
```bash
# depuis la racine ou dans back-end/
cd back-end

# créer un environnement virtuel
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
# ou
.venv\Scripts\activate      # Windows

# installer dépendances (ajoutez requirements.txt si nécessaire)
pip install -r
