BOT_NAME = 'scraper_backend'
SPIDER_MODULES = ['scraper_backend.scraper.spiders']
NEWSPIDER_MODULE = 'scraper_backend.scraper.spiders'
ROBOTSTXT_OBEY = False

# Active le pipeline qui envoie vers Google Drive
ITEM_PIPELINES = {
   'scraper_backend.scraper.pipelines.MasterDataPipeline': 300,
}
