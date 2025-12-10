# Nom du bot
BOT_NAME = 'scraper'

# Où sont les araignées (Spiders) ?
# On est déjà dans le dossier, donc on pointe directement vers 'scraper.spiders'
SPIDER_MODULES = ['scraper.spiders']
NEWSPIDER_MODULE = 'scraper.spiders'

# On ignore le robots.txt pour être sûr d'avoir les données (à utiliser avec responsabilité)
ROBOTSTXT_OBEY = False

# Activation du Pipeline vers Google Drive
ITEM_PIPELINES = {
   'scraper.pipelines.MasterDataPipeline': 300,
}

# Réglages pour éviter d'être banni (Politesse)
DOWNLOAD_DELAY = 1
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
