import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);

    // Chargement des données (avec valeurs par défaut de votre image si l'API est vide)
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchKpis();
                // On utilise les données de l'API, ou celles de l'image par défaut
                setKpis(data || {
                    population_est: "58,588",
                    evolution: "+3.45% vs 2016",
                    maire_actuel_nom: "Joé Bédier",
                    maire_actuel_score: "Élu en 2020 (52.16%)",
                    archives_presse_count: "12,405",
                    presse_detail: "Articles JIR/Clicanoo indexés",
                    donnees_elections_completion: "100%",
                    pipeline_scraping: "PRÊT",
                    pipeline_presse: "EN ATTENTE",
                    pipeline_merge: "IDLE"
                });
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, []);

    // Styles (Dark Mode Theme - Inspiré de votre image)
    const styles = {
        container: { backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif', padding: '20px' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' },
        title: { fontSize: '24px', fontWeight: 'bold', color: '#fff' },
        subtitle: { fontSize: '14px', color: '#64748b' },
        badge: { backgroundColor: '#1e293b', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', color: '#94a3b8', border: '1px solid #334155' },
        gridKPI: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
        card: { backgroundColor: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' },
        cardTitle: { fontSize: '13px', color: '#9ca3af', marginBottom: '10px' },
        cardValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' },
        cardSub: { fontSize: '12px', color: '#10b981' }, // Vert pour l'évolution
        cardSubBlue: { fontSize: '12px', color: '#3b82f6' }, // Bleu pour les détails
        
        mainSection: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }, // 2/3 Carte, 1/3 Pipeline
        mapContainer: { backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1f2937', padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column' },
        mapPlaceholder: { flex: 1, backgroundColor: '#1f2937', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', marginTop: '15px', border: '2px dashed #374151' },
        
        pipelineContainer: { backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1f2937', padding: '20px' },
        pipelineItem: { marginBottom: '20px' },
        pipelineLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#cbd5e1' },
        statusBadge: (status) => ({
            fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold',
            backgroundColor: status === 'PRÊT' ? 'rgba(16, 185, 129, 0.2)' : status === 'EN ATTENTE' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: status === 'PRÊT' ? '#10b981' : status === 'EN ATTENTE' ? '#f59e0b' : '#3b82f6'
        }),
        progressBarBg: { height: '6px', width: '100%', backgroundColor: '#374151', borderRadius: '3px' },
        progressBarFill: (color, width) => ({ height: '100%', width: width, backgroundColor: color, borderRadius: '3px' }),
        
        downloadBtn: { width: '100%', backgroundColor: '#4f46e5', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }
    };

    // Valeurs par défaut pour le rendu initial (évite le crash si kpis est null)
    const data = kpis || {
        population_est: "58,588", evolution: "+3.45% vs 2016",
        maire_actuel_nom: "Joé Bédier", maire_actuel_score: "Élu en 2020 (52.16%)",
        archives_presse_count: "12,405", presse_detail: "Articles JIR/Clicanoo indexés",
        donnees_elections_completion: "100%",
        pipeline_scraping: "PRÊT", pipeline_presse: "EN ATTENTE", pipeline_merge: "IDLE"
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Tableau de Bord</h1>
                    <span style={styles.badge}>ENV: PRODUCTION</span>
                </div>
                <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '12px', color: '#64748b'}}>OODA PIPELINE</div>
                    <div style={{fontSize: '10px', color: '#475569'}}>Saint-André 1976-2026</div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div style={styles.gridKPI}>
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Population (Est. 2025)</div>
                    <div style={styles.cardValue}>{data.population_est}</div>
                    <div style={styles.cardSub}>↗ {data.evolution}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Maire Actuel</div>
                    <div style={styles.cardValue}>{data.maire_actuel_nom}</div>
                    <div style={styles.cardSubBlue}>{data.maire_actuel_score}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Archives Presse</div>
                    <div style={styles.cardValue}>{data.archives_presse_count}</div>
                    <div style={{fontSize: '12px', color: '#9ca3af'}}>{data.presse_detail}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardTitle}>Données Élections</div>
                    <div style={styles.cardValue}>{data.donnees_elections_completion}</div>
                    <div style={styles.cardSub}>1976-2020 complet</div>
                </div>
            </div>

            {/* Main Section: Map & Pipeline */}
            <div className="responsive-grid" style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                
                {/* Carte (Partie Gauche) */}
                <div style={{flex: 2, ...styles.mapContainer}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <h2 style={{fontSize: '16px', fontWeight: 'bold'}}>Couverture Bureaux de Vote</h2>
                        <span style={{fontSize: '12px', color: '#64748b'}}>Saint-André, La Réunion</span>
                    </div>
                    {/* Placeholder pour la carte (image de fond ou Leaflet plus tard) */}
                    <div style={styles.mapPlaceholder}>
                        <div style={{textAlign: 'center'}}>
                            <p style={{fontSize: '20px', fontWeight: 'bold', color: '#3b82f6'}}>SAINT-ANDRÉ</p>
                            <p>RÉUNION</p>
                            <p style={{fontSize: '12px', marginTop: '10px'}}>(Visualisation Cartographique Active)</p>
                        </div>
                    </div>
                </div>

                {/* Pipeline Status (Partie Droite) */}
                <div style={{flex: 1, minWidth: '300px', ...styles.pipelineContainer}}>
                    <h2 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '20px'}}>État du Pipeline</h2>

                    <div style={styles.pipelineItem}>
                        <div style={styles.pipelineLabel}>
                            <span>SCRAPING (INSEE/MININT)</span>
                            <span style={styles.statusBadge(data.pipeline_scraping)}>{data.pipeline_scraping}</span>
                        </div>
                        <div style={styles.progressBarBg}>
                            <div style={styles.progressBarFill('#10b981', '100%')}></div>
                        </div>
                    </div>

                    <div style={styles.pipelineItem}>
                        <div style={styles.pipelineLabel}>
                            <span>PRESSE (JIR/Clicanoo)</span>
                            <span style={styles.statusBadge(data.pipeline_presse)}>{data.pipeline_presse}</span>
                        </div>
                        <div style={styles.progressBarBg}>
                            <div style={styles.progressBarFill('#f59e0b', '60%')}></div>
                        </div>
                    </div>

                    <div style={styles.pipelineItem}>
                        <div style={styles.pipelineLabel}>
                            <span>MERGE & NORMALISATION</span>
                            <span style={styles.statusBadge(data.pipeline_merge)}>{data.pipeline_merge}</span>
                        </div>
                        <div style={styles.progressBarBg}>
                            <div style={styles.progressBarFill('#374151', '0%')}></div>
                        </div>
                    </div>

                    <button style={styles.downloadBtn}>
                        📥 Télécharger le Pack (.zip)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
