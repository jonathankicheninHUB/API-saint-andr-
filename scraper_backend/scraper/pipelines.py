import os
import json
from datetime import datetime
from itemadapter import ItemAdapter
from .google_drive_manager import GoogleDriveManager

class MasterDataPipeline:
    def __init__(self):
        self.items = []
        self.logs = []
        self.start_time = datetime.now()

    def open_spider(self, spider):
        self.logs.append(f"🟢 [{datetime.now().strftime('%H:%M:%S')}] Démarrage du Spider {spider.name}")

    def process_item(self, item, spider):
        # On collecte les données et on logue le succès
        adapter = ItemAdapter(item)
        self.items.append(adapter.asdict())
        self.logs.append(f"✅ [{datetime.now().strftime('%H:%M:%S')}] Donnée récupérée pour l'année {adapter.get('annee', 'Inconnue')}")
        return item

    def close_spider(self, spider):
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        # 1. Analyse de Santé (Health Check)
        if not self.items:
            status = "CRITICAL_FAILURE"
            self.logs.append(f"❌ [{datetime.now().strftime('%H:%M:%S')}] ALERTE : Aucune donnée trouvée !")
        else:
            status = "SUCCESS"
            self.logs.append(f"🏁 [{datetime.now().strftime('%H:%M:%S')}] Terminée avec succès en {duration:.2f}s")

        # 2. Création de l'objet de Monitoring
        monitoring_report = {
            "status": status,
            "last_execution": end_time.strftime("%Y-%m-%d %H:%M:%S"),
            "duration_seconds": duration,
            "items_count": len(self.items),
            "execution_logs": self.logs,
            "version": "1.0.0"
        }

        # 3. Construction du JSON Final (Data + Monitoring)
        # Si on a des données, on prend la dernière et on y greffe le monitoring
        if self.items:
            final_json = self.items[0]['dashboard_data']
            final_json['monitoring'] = monitoring_report
        else:
            # Si échec, on envoie juste le rapport d'erreur pour que le dashboard le sache
            final_json = {
                "monitoring": monitoring_report,
                # Valeurs par défaut pour ne pas casser le site
                "population_est": "Erreur Scraping",
                "maire_actuel_nom": "Erreur",
                "donnees_elections_completion": "0%"
            }

        # 4. Envoi Sécurisé vers Google Drive
        self.logs.append(f"📤 [{datetime.now().strftime('%H:%M:%S')}] Tentative d'upload vers Drive...")
        
        try:
            creds_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
            folder_id = os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
            filename = os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')

            gd = GoogleDriveManager(creds_path, folder_id, filename)
            success = gd.update_master_data(final_json)
            
            if success:
                print("✅ SUCCÈS TOTAL : Monitoring et Données synchronisés.")
            else:
                print("❌ ERREUR DRIVE : L'upload a échoué.")
                
        except Exception as e:
            print(f"❌ ERREUR CRITIQUE SYSTEME : {str(e)}")
