import os
import json
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload

class GoogleDriveManager:
    def __init__(self, credentials_path=None, folder_id=None, filename=None):
        # 1. Récupération des configurations depuis les variables Render
        self.credentials_path = credentials_path or os.environ.get('GOOGLE_DRIVE_CREDENTIALS_PATH', './service_account_key.json')
        self.folder_id = folder_id or os.environ.get('GOOGLE_DRIVE_MASTER_FOLDER_ID')
        self.filename = filename or os.environ.get('MASTER_JSON_FILENAME', 'master_data_sa.json')
        self.service = None

        # 2. Authentification sécurisée (Création du fichier clé temporaire)
        self._authenticate()

    def _authenticate(self):
        try:
            # On vérifie si le contenu de la clé est dans les variables d'environnement (Cas Render)
            json_content = os.environ.get('SERVICE_ACCOUNT_JSON')
            
            if json_content:
                print("🔐 Chargement de la clé depuis les variables d'environnement...")
                with open(self.credentials_path, 'w') as f:
                    f.write(json_content)
            
            # Connexion à Google
            SCOPES = ['https://www.googleapis.com/auth/drive']
            creds = service_account.Credentials.from_service_account_file(
                self.credentials_path, scopes=SCOPES)
            self.service = build('drive', 'v3', credentials=creds)
            print("✅ Connexion Google Drive réussie.")
            
        except Exception as e:
            print(f"❌ Erreur critique d'authentification : {str(e)}")
            self.service = None

    def _find_file_id(self):
        """Cherche l'ID du fichier s'il existe déjà"""
        if not self.service: return None
        query = f"name='{self.filename}' and '{self.folder_id}' in parents and trashed=false"
        results = self.service.files().list(q=query, spaces='drive', fields='files(id)').execute()
        items = results.get('files', [])
        return items[0]['id'] if items else None

    def update_master_data(self, data_json):
        """Upload ou Met à jour le fichier JSON sur le Drive"""
        if not self.service: return False
        
        file_id = self._find_file_id()
        
        # Préparation du contenu
        media = MediaIoBaseUpload(
            io.BytesIO(json.dumps(data_json, indent=2, ensure_ascii=False).encode('utf-8')),
            mimetype='application/json',
            resumable=True
        )

        if file_id:
            print(f"🔄 Mise à jour du fichier existant ({file_id})...")
            self.service.files().update(fileId=file_id, media_body=media).execute()
        else:
            print(f"✨ Création du nouveau fichier {self.filename}...")
            metadata = {'name': self.filename, 'parents': [self.folder_id]}
            self.service.files().create(body=metadata, media_body=media).execute()
        
        return True

    def get_master_data(self):
        """Télécharge et lit le JSON depuis le Drive"""
        if not self.service: return None
        
        file_id = self._find_file_id()
        if not file_id:
            print("⚠️ Aucun fichier trouvé sur le Drive.")
            return None

        print(f"⬇️ Téléchargement des données...")
        request = self.service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
        
        fh.seek(0)
        return json.load(fh)
