from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess
# Import correct du module
from scraper_backend.scraper.google_drive_manager import GoogleDriveManager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- UTILITAIRE : Récupérer le Manager Drive ---
def get_gd_manager():
    creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
    folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
    filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
    
    # Création du fichier clé si nécessaire (contexte Render)
    if os.environ.get('SERVICE_ACCOUNT_JSON'):
        with open(creds_path, 'w') as f:
            f.write(os.environ.get('SERVICE_ACCOUNT_JSON'))
            
    return GoogleDriveManager(creds_path, folder_id, filename)

# --- 1. ENDPOINT LECTURE (Pour le site) ---
@app.get("/kpis")
def get_kpis():
    try:
        gd = get_gd_manager()
        data = gd.get_master_data()
        if data:
            return data
        return {
            "population_est": "En attente...",
            "system_monitoring": {"status": "WAITING", "logs": ["Fichier vide ou absent"]}
        }
    except Exception as e:
        return {"error": str(e), "population_est": "Erreur connexion"}

# --- 2. ENDPOINT ROBOT (Pour lancer le scraping) ---
def run_spider_task():
    print("🕷️ Lancement du Scrapy Spider...")
    # On lance depuis le dossier racine 'scraper_backend' où se trouve scrapy.cfg
    subprocess.run(["scrapy", "crawl", "elections_saint_andre"], cwd="scraper_backend")

@app.get("/trigger-scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_spider_task)
    return {"status": "SUCCÈS", "message": "Robot lancé ! Vérifiez le fichier sur Drive dans 30s."}

# --- 3. ENDPOINTS DIAGNOSTIC (Pour vérifier les pannes) ---
@app.get("/test-drive")
def test_drive():
    try:
        gd = get_gd_manager()
        file_id = gd._find_file_id()
        return {"status": "SUCCÈS", "message": f"Connexion OK. Fichier ID: {file_id}"}
    except Exception as e:
        return {"status": "ÉCHEC", "error": str(e)}

@app.get("/debug-full")
def debug_full():
    # Lance le robot en mode verbeux et capture la sortie
    result = subprocess.run(
        ["scrapy", "crawl", "elections_saint_andre"],
        cwd="scraper_backend",
        capture_output=True,
        text=True
    )
    return {"STDOUT": result.stdout, "STDERR": result.stderr}

@app.get("/")
def root():
    return {"status": "API En Ligne", "version": "Finale Corrigée"}
