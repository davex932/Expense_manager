// URL de base de l'API — utilise la variable d'environnement en prod, localhost en dev
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
