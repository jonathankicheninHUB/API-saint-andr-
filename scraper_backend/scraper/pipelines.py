import os
import datetime
from itemadapter import ItemAdapter
from .google_drive_manager import GoogleDriveManager

class MasterDataPipeline:
    def __init__(self):
        self.items = []
        self.logs = [] # On crée une liste pour stocker les évènements

    def process_item(self, item, spider):
        self.items.append(dict(item))
        self.logs.append(f"✅ Item récupéré : {item.get('annee', 'Inconnu')}")
        return item

    def close_spider(self, spider):
        # Création du timestamp
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 1. Préparation du rapport système
        system_status = {
            "last_run": now,
            "status": "SUCCESS" if self.items else "WARNING_EMPTY",
            "items_collected": len(self.items),
            "logs": self.logs
        }

        # 2. Construction du JSON Final
        if self.items:
            final_data = self.items[0]['dashboard_data']
            # On injecte le rapport système DANS les données
            final_data['system_monitoring'] = system_status
        else:
            # Cas d'urgence : le robot a tourné mais n'a rien trouvé
            final_data = {
                "system_monitoring": {
                    "last_run": now,
                    "status": "CRITICAL_FAILURE",
                    "error": "Aucune donnée collectée par le Spider"
                }
            }

        # 3. Envoi vers Drive
        print(f"[{now}] 📤 Envoi du rapport de monitoring vers Drive...")
        
        try:
            # Récupération des clés
            creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
            folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
            filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')

            gd = GoogleDriveManager(creds_path, folder_id, filename)
            gd.update_master_data(final_data)
            print("✅ SUCCÈS : Monitoring mis à jour sur Google Drive.")
            
        except Exception as e:
            print(f"❌ ERREUR CRITIQUE DRIVE : {str(e)}")
