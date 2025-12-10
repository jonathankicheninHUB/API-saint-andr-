import scrapy

class ElectionItem(scrapy.Item):
    """
    Ce modèle définit la structure exacte des données pour le projet Saint-André.
    Le Scraper devra remplir ces champs.
    """
    
    # --- 1. Identification du Scrutin ---
    annee = scrapy.Field()          # Ex: 2020
    type_scrutin = scrapy.Field()   # Ex: "Municipales"
    tour = scrapy.Field()           # Ex: 2 (Second tour)

    # --- 2. Données Démographiques & KPIs (Pour le haut du Dashboard) ---
    population = scrapy.Field()     # Population recensée cette année-là
    inscrits = scrapy.Field()       # Nombre total d'inscrits
    votants = scrapy.Field()        # Nombre total de votants
    abstention_pourcent = scrapy.Field() # Taux d'abstention
    
    # --- 3. Maire / Vainqueur (Pour la carte "Maire Actuel") ---
    maire_elu = scrapy.Field()      # Nom du vainqueur
    score_maire = scrapy.Field()    # Pourcentage du vainqueur

    # --- 4. Résultats Détaillés (Pour les graphiques) ---
    # Liste d'objets : [{'candidat': 'Nom', 'voix': 1200, 'pourcent': 45.5}, ...]
    resultats_globaux = scrapy.Field()

    # --- 5. Données Géographiques (Pour la Carte Interactive) ---
    # Liste des bureaux : [{'id': '1', 'nom': 'Mairie', 'lat': -20.9, 'lon': 55.6, 'lead': 'Bédier'}, ...]
    bureaux_de_vote = scrapy.Field()

    # --- 6. Métadonnées Techniques ---
    url_source = scrapy.Field()     # D'où vient l'info (INSEE/Gouv)
    date_scraping = scrapy.Field()  # Quand l'info a été récupérée
