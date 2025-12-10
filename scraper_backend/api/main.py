from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import io
import subprocess
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

app = FastAPI()

# Configuration CORS (Autorise tout pour la démo, à restreindre en prod stricte)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FONCTIONS UTILITAIRES (Drive & System) ---

def get_drive_service():
    """Crée la connexion sécurisée Google Drive"""
    try:
        creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
        json_content = os.environ.get('SERVICE_ACCOUNT_JSON')

        # Régénération de la clé si absente (Contexte Render)
        if json_content and not os.path.exists(creds_path):
            with open(creds_path, 'w') as f:
                f.write(json_content)

        SCOPES = ['https://www.googleapis.com/auth/drive']
        creds = service_account.Credentials.from_service_account_file(creds_path, scopes=SCOPES)
        return build('drive', 'v3', credentials=creds)
    except Exception as e:
        print(f"Auth Error: {e}")
        return None

def download_master_json():
    """Télécharge le fichier de données + monitoring"""
    service = get_drive_service()
    if not service: return None

    folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
    filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
    
    query = f"name='{filename}' and '{folder_id}' in parents and trashed=false"
    results = service.files().list(q=query, spaces='drive', fields='files(id)').execute()
    items = results.get('files', [])
    
    if not items: return None

    request = service.files().get_media(fileId=items[0]['id'])
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False: status, done = downloader.next_chunk()
    
    fh.seek(0)
    return json.load(fh)

def run_spider_subprocess():
    """Exécute le script Scrapy dans un processus isolé"""
    print("🚀 API : Lancement du processus Scrapy...")
    subprocess.run(["scrapy", "crawl", "elections_saint_andre"], cwd="scraper_backend")

# --- ENDPOINTS API ---

@app.get("/")
def read_root():
    return {"system": "OODA API", "status": "ONLINE", "version": "2.0"}

@app.get("/health")
def health_check():
    """Monitoring technique de l'API elle-même"""
    return {
        "api_status": "UP",
        "drive_configured": bool(os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')),
        "credentials_present": bool(os.environ.get('SERVICE_ACCOUNT_JSON'))
    }

@app.get("/kpis")
def get_kpis():
    """Renvoie les données + le rapport de monitoring"""
    data = download_master_json()
    if data:
        return data
    return {
        "population_est": "En attente...",
        "monitoring": {"status": "NO_DATA", "last_execution": "Jamais"}
    }

@app.get("/trigger-scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Bouton poussoir pour lancer le robot"""
    background_tasks.add_task(run_spider_subprocess)
    return {"status": "ACCEPTED", "message": "Le robot a été lancé en arrière-plan. Vérifiez le monitoring dans 1 minute."}
