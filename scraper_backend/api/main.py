from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/")
def read_root():
    return {"Status": "L'API fonctionne !"}

@app.get("/kpis")
def get_kpis():
    return {
        "population_est": 58588,
        "maire_actuel_nom": "Joé Bédier",
        "donnees_elections_completion": "100%"
    }
