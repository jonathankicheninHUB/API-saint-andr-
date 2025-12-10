# Fichier : scraper_backend/api/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from datetime import datetime

# --- Dépendance : data_loader (Simulé ici) ---
# Dans un vrai déploiement, ce module gérerait le chargement du Master JSON
# depuis Google Drive au démarrage du serveur.

MASTER_DATA = {
    "commune": "Saint-André",
    "demographie": [
        {"annee": 2025, "population": 58588, "evolution_vs_2016": 0.0343}
    ],
    "elections": [
        {"annee": 2020, "type_scrutin": "Municipales", "tour": 1,
         "candidats": [{"nom": "Joé Bédier", "pourcentage": 52.16}],
         "bureaux_de_vote": [
             # Coordonnées géocodées pour la carte (F07)
             {"bv_id": "BV01", "nom_bv": "Mairie", "latitude": -20.9630, "longitude": 55.6500, "couvert_geo": True},
             {"bv_id": "BV02", "nom_bv": "École X", "latitude": -20.9700, "longitude": 55.6600, "couvert_geo": True}
         ]}
    ],
    "presse": [{"titre": "Article A", "date_publication": "2020-03-01"}],
    "last_updated": datetime.now().isoformat()
}
# ---------------------------------------------

app = FastAPI(title="OODA Data API")

# Configuration CORS pour que votre Front-end (React) puisse accéder à l'API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ⚠️ En production, remplacez "*" par l'URL de votre Front-end (ex: https://votre-app.vercel.app)
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/kpis", response_model=Dict[str, Any])
async def get_kpis():
    """Endpoint F06 : Récupère les indicateurs clés du tableau de bord."""
    latest_demography = MASTER_DATA.get('demographie', [])[-1]
    
    kpis = {
        "population_est": latest_demography.get('population'),
        "population_evolution": latest_demography.get('evolution_vs_2016'),
        "maire_actuel_nom": "Joé Bédier",
        "maire_actuel_score": 52.16, 
        "archives_presse_count": len(MASTER_DATA.get('presse', [])),
        "donnees_elections_completion": "100%", 
        "last_data_update": MASTER_DATA.get('last_updated')
    }
    return kpis

@app.get("/bureaux-de-vote/{annee_scrutin}", response_model=List[Dict[str, Any]])
async def get_bureaux_de_vote(annee_scrutin: int):
    """Endpoint F07 : Récupère la liste des BV pour la carte."""
    election = next((e for e in MASTER_DATA.get('elections', []) if e['annee'] == annee_scrutin), None)
    
    if not election:
        raise HTTPException(status_code=404, detail=f"Aucune élection trouvée pour l'année {annee_scrutin}.")
        
    return election.get('bureaux_de_vote', [])

# Endpoint pour le pipeline Scrapy (pour recharger les données après l'upload GDrive)
@app.post("/reload-data")
async def reload_data(key: Dict[str, str]):
    # Note: En production, on vérifierait la clé secrète ici avant de recharger.
    # Dans un environnement sans installation, on simule le rechargement.
    print("API notifiée. Simulation du rechargement des données depuis Google Drive...")
    return {"status": "success", "message": "Rechargement des données déclenché."}
