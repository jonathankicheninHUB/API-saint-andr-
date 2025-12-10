from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import io
import subprocess
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

app = FastAPI()

# 1. Autoriser le site (Frontend) à lire les données
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En prod, on mettrait l'URL Vercel
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- OUTIL : Gestionnaire Google Drive (Lecture seule) ---
# Intégré ici pour garantir que ça marche sans erreur de dossier
def get_data_from_drive():
    try:
        # Récupération des secrets Render
        creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
        folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
        filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
        json_content = os.environ.get('SERVICE_ACCOUNT_JSON')

        # Création du fichier clé temporaire si besoin
        if json_content and not os.path.exists(creds_path):
            with open(creds_path, 'w') as f:
                f.write(json_content)

        # Connexion Google
        SCOPES = ['https://www.googleapis.com/auth/drive']
        creds = service_account.Credentials.from_service_account_file(creds_path, scopes=SCOPES)
        service = build('drive', 'v3', credentials=creds)

        # Recherche du fichier
        query = f"name='{filename}' and '{folder_id}' in parents and trashed=false"
        results = service.files().list(q=query, spaces='drive', fields='files(id)').execute()
        items = results.get('files', [])
        
        if not items:
            return None # Fichier pas encore créé

        # Téléchargement
        file_id = items[0]['id']
        request = service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
        
        fh.seek(0)
        return json.load(fh)

    except Exception as e:
        print(f"ERREUR DRIVE: {e}")
        return None

# --- ENDPOINT 1 : Lancer le Robot (Trigger) ---
def run_spider_task():
    print("🕷️ Lancement du Scrapy Spider...")
    # Lance la commande scrapy dans le dossier racine
    subprocess.run(["scrapy", "crawl", "elections_saint_andre"], cwd="scraper_backend")

@app.get("/trigger-scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Lance le robot en arrière-plan"""
    background_tasks.add_task(run_spider_task)
    return {"status": "🤖 Robot lancé ! Vérifiez le site dans 30 secondes."}

# --- ENDPOINT 2 : Lire les Données (KPIs) ---
@app.get("/kpis")
def get_kpis():
    """Lit le fichier sur Drive et l'envoie au site"""
    data = get_data_from_drive()
    
    if data:
        print("✅ Données chargées depuis Drive")
        return data
    else:
        print("⚠️ Pas de données sur Drive, envoi d'attente")
        # Données d'attente pour que le site ne soit pas vide au premier lancement
        return {
            "population_est": "En attente...",
            "evolution": "...",
            "maire_actuel_nom": "Lancez le Robot",
            "maire_actuel_score": "---",
            "archives_presse_count": "0",
            "donnees_elections_completion": "0%",
            "pipeline_scraping": "EN PAUSE",
            "pipeline_presse": "EN PAUSE",
            "pipeline_merge": "EN PAUSE"
        }

@app.get("/")
def read_root():
    return {"Status": "API OODA En Ligne"}
