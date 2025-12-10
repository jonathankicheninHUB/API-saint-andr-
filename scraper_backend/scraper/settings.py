BOT_NAME = 'scraper_backend'
SPIDER_MODULES = ['scraper_backend.scraper.spiders']
NEWSPIDER_MODULE = 'scraper_backend.scraper.spiders'
ROBOTSTXT_OBEY = False

# C'est cette ligne qui active votre script pipelines.py
ITEM_PIPELINES = {
   'scraper_backend.scraper.pipelines.MasterDataPipeline': 300,
}
