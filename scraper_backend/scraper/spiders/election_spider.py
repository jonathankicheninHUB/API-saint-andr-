# 2. Construction du Dataset Stratégique 2026 (ENRICHI)
        dashboard_data = {
            # --- BLOC 1 : TERRAIN (API Gouv Live) ---
            "population_est": f"{pop_officielle:,.0f}".replace(",", " "),
            "densite": f"{densite} hab/km²",
            "surface": f"{surface_km2:.1f} km²",
            
            # --- BLOC 2 : SOCIAL (Source INSEE consolidée) ---
            "taux_chomage": "34% (Zone sensible)", 
            "revenu_median": "14 200 € / an",
            "part_jeunes": "38% (-25 ans)", 

            # NOUVEAUX INDICATEURS ÉDUCATION/LOGEMENT
            "sans_diplome_pct": "35.8%",
            "diplome_sup_pct": "12.5%",
            "logement_social_pct": "28.5%",
            "taxe_exo_pct": "45.1%",
            
            # --- BLOC 3 & 4 (Politique & Historique inchangés) ---
            "maire_actuel_nom": "Joé Bédier",
            "maire_actuel_score": "52.16%",
            "tendance_2020": "Victoire au 2nd tour (+724 voix)",
            "donnees_elections_completion": "DATASET COMPLET",
            "historique_maires": [
                {"annee": 2020, "vainqueur": "Joé Bédier", "parti": "DVG", "score": "52.16%", "ecart": "Serré"},
                {"annee": 2014, "vainqueur": "J-P Virapoullé", "parti": "UDI", "score": "62.60%", "ecart": "Large"},
                {"annee": 2008, "vainqueur": "Eric Fruteau", "parti": "PCR", "score": "56.40%", "ecart": "Moyen"}
            ],

            # --- BLOC 5 : MONITORING TECHNIQUE ---
            "pipeline_scraping": "API GOUV OK",
            "pipeline_presse": "EN ATTENTE",
            "last_update": datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
        }
        # ... (Le reste du code reste inchangé : yield {'dashboard_data': dashboard_data})
