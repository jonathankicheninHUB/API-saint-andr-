import os
import json
import datetime
from itemadapter import ItemAdapter
from .google_drive_manager import GoogleDriveManager

class MasterDataPipeline:
    def __init__(self):
        self.items = []
        self.logs = []

    def process_item(self, item, spider):
        # On capture les données envoyées par le robot
        adapter = ItemAdapter(item)
        self.items.append(adapter.asdict())
        self.logs.append(f"✅ Donnée reçue : {adapter.get('dashboard_data', {}).get('population_est', 'Inconnue')}")
        return item

    def close_spider(self, spider):
        print("🏁 Fin du robot. Analyse des résultats...")
        
        # --- ROUE DE SECOURS (BACKUP DATA) ---
        # Si le robot revient les mains vides, on utilise ces données pour ne pas casser le site
        backup_data = {
            "population_est": "58 588 (Backup)",
            "densite": "1200 hab/km²",
            "taux_chomage": "34% (Est.)",
            "revenu_median": "14 200 €",
            "part_jeunes": "38%",
            "maire_actuel_nom": "Joé Bédier",
            "maire_actuel_score": "52.16%",
            "tendance_2020": "Données de secours activées",
            "historique_maires": [
                {"annee": 2020, "vainqueur": "Joé Bédier", "parti": "DVG", "score": "52.16%"},
                {"annee": 2014, "vainqueur": "J-P Virapoullé", "parti": "UDI", "score": "62.60%"}
            ],
            "last_update": datetime.datetime.now().strftime("%d/%m/%Y %H:%M"),
            "system_monitoring": {
                "status": "WARNING_BACKUP",
                "logs": ["⚠️ Le robot n'a pas trouvé de données, activation du backup."],
                "last_run": "Mode Secours"
            }
        }

        # Décision : On prend les données du robot, OU le backup
        if self.items and 'dashboard_data' in self.items[0]:
            final_json = self.items[0]['dashboard_data']
            # On injecte le monitoring réel
            final_json['system_monitoring'] = {
                "status": "SUCCESS",
                "items_count": len(self.items),
                "duration": "OK",
                "execution_logs": self.logs
            }
            print("✅ Données du robot valides.")
        else:
            final_json = backup_data
            print("⚠️ Robot vide -> Utilisation du BACKUP.")

        # --- UPLOAD VERS DRIVE ---
        try:
            creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
            folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
            filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')

            gd = GoogleDriveManager(creds_path, folder_id, filename)
            gd.update_master_data(final_json)
            print("📤 Fichier JSON écrit sur le Drive avec succès.")
            
        except Exception as e:
            print(f"❌ ERREUR CRITIQUE DRIVE : {str(e)}")
