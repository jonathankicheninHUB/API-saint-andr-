from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import io
import subprocess
# Importation du manager (avec le chemin complet pour éviter les erreurs)
from scraper.google_drive_manager import GoogleDriveManager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. FONCTION DE LECTURE DRIVE ---
def get_data_from_drive():
    try:
        # Récupération des secrets
        creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
        folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
        filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
        
        # On recrée le fichier clé si nécessaire (contexte Render)
        json_content = os.environ.get('SERVICE_ACCOUNT_JSON')
        if json_content:
            with open(creds_path, 'w') as f:
                f.write(json_content)

        # Connexion
        gd = GoogleDriveManager(creds_path, folder_id, filename)
        
        # Téléchargement
        data = gd.get_master_data()
        return data
    except Exception as e:
        print(f"ERREUR LECTURE DRIVE: {e}")
        return None

# --- 2. ENDPOINT DASHBOARD (Ce que le site affiche) ---
@app.get("/kpis")
def get_kpis():
    data = get_data_from_drive()
    if data:
        return data
    else:
        # Données d'attente si le fichier est vide ou inaccessible
        return {
            "population_est": "En attente...",
            "maire_actuel_nom": "Initialisation...",
            "system_monitoring": {
                "status": "WAITING",
                "logs": ["En attente de la première exécution du robot"]
            }
        }

# --- 3. ENDPOINT ROBOT (Le Déclencheur) ---
def run_spider_task():
    print("🕷️ Lancement du Scrapy Spider...")
    # On lance la commande depuis le dossier parent
    subprocess.run(["scrapy", "crawl", "elections_saint_andre"], cwd="/opt/render/project/src/scraper_backend")

@app.get("/trigger-scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_spider_task)
    return {"status": "SUCCÈS", "message": "Robot lancé ! Vérifiez le fichier sur Drive dans 30 secondes."}

# --- 4. ENDPOINT DIAGNOSTIC (Pour vérifier que ça marche) ---
@app.get("/debug-full")
def debug_full():
    result = subprocess.run(
        ["scrapy", "crawl", "elections_saint_andre"],
        cwd="/opt/render/project/src/scraper_backend",
        capture_output=True,
        text=True
    )
    return {"STDOUT": result.stdout, "STDERR": result.stderr}

@app.get("/")
def root():
    return {"status": "API En Ligne", "version": "Finale"}
