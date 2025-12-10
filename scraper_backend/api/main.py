from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess
import sys

app = FastAPI()

# Autoriser le frontend à nous parler
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "API En Ligne", "mode": "Production"}

# --- Endpoint pour les KPIs (Données réelles) ---
@app.get("/kpis")
def get_kpis():
    # Ici, dans le futur, on lira le fichier JSON téléchargé du Drive
    # Pour l'instant, on renvoie une confirmation que l'API répond
    return {
        "population_est": "58,588",
        "evolution": "+3.45%",
        "maire_actuel_nom": "Joé Bédier",
        "maire_actuel_score": "52.16%",
        "archives_presse_count": "12,405",
        "donnees_elections_completion": "100%",
        "pipeline_scraping": "PRÊT"
    }

# --- Endpoint pour LANCER LE SCRAPER (Le Déclencheur) ---
def run_spider():
    print("🚀 Lancement du Scraper...")
    # Lance la commande scrapy en arrière-plan
    subprocess.run(["scrapy", "crawl", "elections_saint_andre"], cwd="/opt/render/project/src/scraper_backend")

@app.get("/trigger-scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_spider)
    return {"message": "Scraping lancé en arrière-plan. Vérifiez Google Drive dans 2 minutes."}
