from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess
import sys
import json
from scraper_backend.scraper.google_drive_manager import GoogleDriveManager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. TEST DE CONNEXION DRIVE (Immédiat) ---
@app.get("/test-drive")
def test_drive_connection():
    try:
        creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
        # On force la création du fichier clé
        if os.environ.get('SERVICE_ACCOUNT_JSON'):
            with open(creds_path, 'w') as f:
                f.write(os.environ.get('SERVICE_ACCOUNT_JSON'))
        
        folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
        filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
        
        gd = GoogleDriveManager(creds_path, folder_id, filename)
        # Test de lecture simple pour voir si ça connecte
        gd._find_file_id() 
        return {"status": "SUCCÈS", "message": "Connexion Google Drive établie !"}
    except Exception as e:
        return {"status": "ÉCHEC", "error": str(e)}

# --- 2. DIAGNOSTIC COMPLET DU ROBOT (La Boîte Noire) ---
@app.get("/debug-full")
def debug_scraper():
    """
    Lance le robot et CAPTURE tout ce qu'il dit (Erreurs comprises).
    Affiche le résultat directement à l'écran.
    """
    print("🕵️ Lancement du diagnostic complet...")
    
    # Commande exacte pour lancer Scrapy
    command = ["scrapy", "crawl", "elections_saint_andre"]
    
    try:
        # On lance le processus en attendant la réponse (timeout 60s)
        # cwd="scraper_backend" est crucial car on est à la racine sur Render
        result = subprocess.run(
            command,
            cwd="scraper_backend",
            capture_output=True,
            text=True,
            timeout=60
        )
        
        return {
            "EXIT_CODE": result.returncode,
            "STDOUT (Ce qui a marché)": result.stdout,
            "STDERR (Les Erreurs)": result.stderr
        }
    except Exception as e:
        return {"CRITICAL_ERROR": str(e)}

# --- 3. Route standard pour le site ---
@app.get("/kpis")
def get_kpis():
    # Lecture du fichier Drive
    try:
        creds = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
        folder = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
        file = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
        gd = GoogleDriveManager(creds, folder, file)
        return gd.get_master_data() or {"error": "Fichier vide ou absent"}
    except:
        return {"population_est": "En attente..."}

@app.get("/")
def root(): return {"status": "Mode Diagnostic Activé"}
