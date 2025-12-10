# 🗳️ OODA Pipeline - Saint-André (1976-2026)

![Status](https://img.shields.io/badge/Status-Live-success)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)
![Backend](https://img.shields.io/badge/Backend-Render-purple)
![Data](https://img.shields.io/badge/Data-Google%20Drive-blue)

Une application Full-Stack de **Data Intelligence Électorale** pour la commune de Saint-André (La Réunion). Ce projet automatise la collecte, le traitement et la visualisation des données électorales et de presse sur 50 ans.

🔗 **Accès au Tableau de Bord :** [Lien de votre site Vercel ici]
🔗 **Accès à l'API :** [https://api-saint-andr.onrender.com](https://api-saint-andr.onrender.com)

---

## 🏗️ Architecture Technique

Le projet est conçu en **Monorepo** (Backend et Frontend dans le même dépôt) et déployé sur une architecture Cloud sans serveur (Serverless).

```mermaid
graph LR
    A[Scraper Python] -->|Write JSON| B(Google Drive)
    C[API FastAPI] -->|Read JSON| B
    D[Frontend React] -->|Fetch Data| C
    E[Utilisateur] -->|View| D
````

| Composant | Technologie | Hébergement | Rôle |
| :--- | :--- | :--- | :--- |
| **Backend** | Python, FastAPI, Scrapy | **Render** | API REST & Moteur de Scraping |
| **Frontend** | React.js (Create React App) | **Vercel** | Interface Utilisateur & Dashboard |
| **Database** | JSON Flat File | **Google Drive** | Stockage persistant des données |

-----

## 📂 Structure du Projet

```bash
API-saint-andr-/
├── scraper_backend/        # 🐍 LE MOTEUR (Python)
│   ├── api/                # Code de l'API FastAPI
│   │   └── main.py         # Points d'entrée (Endpoints)
│   ├── scraper/            # Le Robot Scrapy
│   │   ├── spiders/        # Logique de collecte
│   │   ├── pipelines.py    # Export vers Drive
│   │   └── items.py        # Schéma des données
│   └── requirements.txt    # Dépendances Python
│
└── web_frontend/           # ⚛️ L'INTERFACE (React)
    ├── public/             # Fichiers statiques
    ├── src/
    │   ├── views/          # Pages (Dashboard)
    │   ├── services/       # Connexion API
    │   └── ...
    └── package.json        # Dépendances Node.js
```

-----

## 🚀 Fonctionnalités Clés

### 1\. Scraping Automatisé (`/trigger-scrape`)

Un robot Scrapy intelligent visite les sources de données ciblées, extrait les informations clés (Résultats électoraux, Population, Presse) et génère un rapport structuré.

### 2\. Monitoring Intégré

Le système surveille sa propre santé. Chaque exécution du robot est journalisée (Logs, Durée, Statut) et visible directement sur le Dashboard.

### 3\. Stockage Cloud Sécurisé

Aucune base de données complexe. Les données sont stockées sous forme de `Master JSON` sur un Google Drive sécurisé, accessible via un Compte de Service Google Cloud.

-----

## 🛠️ Installation & Déploiement

### Pré-requis

  * Un compte **GitHub**
  * Un compte **Render** (pour le Backend)
  * Un compte **Vercel** (pour le Frontend)
  * Un **Service Account Google Cloud** (Fichier JSON)

### 1\. Déploiement Backend (Render)

1.  Créer un **Web Service** sur Render connecté à ce dépôt.
2.  **Runtime :** Python 3
3.  **Root Directory :** (Laisser vide)
4.  **Build Command :** `pip install -r scraper_backend/requirements.txt`
5.  **Start Command :** `uvicorn scraper_backend.api.main:app --host 0.0.0.0 --port $PORT`
6.  **Variables d'Environnement :**
      * `GOOGLE_DRIVE_MASTER_FOLDER_ID` : ID du dossier Drive
      * `SERVICE_ACCOUNT_JSON` : Contenu du fichier clé Google
      * `GOOGLE_DRIVE_CREDENTIALS_PATH` : `./service_account_key.json`

### 2\. Déploiement Frontend (Vercel)

1.  Importer le projet sur Vercel.
2.  **Framework Preset :** Create React App
3.  **Root Directory :** `web_frontend`
4.  **Build Command :** `npm run build`
5.  **Output Directory :** `build`

-----

## 🎮 Utilisation de l'API

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Vérifier le statut de l'API |
| `GET` | `/health` | Healthcheck complet (Drive, API) |
| `GET` | `/kpis` | Récupérer les données pour le Dashboard |
| `GET` | `/trigger-scrape` | **Action :** Lancer le robot de scraping manuellement |

-----

## 🛡️ Sécurité

  * Les clés d'API ne sont **jamais** stockées dans le code (utilisation des variables d'environnement).
  * L'authentification Google Drive utilise un fichier temporaire généré à la volée.

-----

**© 2025 - OODA Pipeline Project**

```
```
