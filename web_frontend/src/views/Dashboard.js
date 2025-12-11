import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);

    const refreshData = async () => {
        try {
            const res = await fetchKpis();
            setData(res || {});
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        refreshData();
        // Rafraîchissement régulier pour la donnée live
        const interval = setInterval(refreshData, 600000); 
        return () => clearInterval(interval);
    }, []);

    const d = data || {};
    // Récupération des logs techniques
    const mon = d.system_monitoring || { status: 'UNKNOWN', execution_logs: [], last_run: 'N/A' };

    // Styles (Design System V4 - Analyste Moderne)
    const styles = {
        // Base Page
        page: {background: '#0a101a', minHeight: '100vh', color: '#e0e7ff', padding: '30px', fontFamily: 'system-ui, sans-serif'},
        header: {borderBottom: '2px solid #1f2937', paddingBottom: '25px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'},
        
        // Grille principale
        grid: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'},
        
        // Carte Modernisée
        card: {
            background: '#1a202c', 
            padding: '20px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease-in-out',
            border: '1px solid #374151'
        },
        cardLabel: {color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px', fontWeight: '500'},
        cardValue: {fontSize: '32px', fontWeight: '700', color: '#fff', lineHeight: 1.1},
        cardSub: {fontSize: '13px', marginTop: '5px', color: '#6b7280'},
        
        // Titres de Section (avec underline)
        sectionTitle: {
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#e0e7ff', 
            marginTop: '30px', 
            marginBottom: '15px', 
            borderBottom: '2px solid #007bff', 
            paddingBottom: '5px'
        },
        
        // Tableau (Historique)
        table: {width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px'},
        th: {textAlign: 'left', color: '#94a3b8', padding: '12px 10px', borderBottom: '1px solid #374151', textTransform: 'uppercase', fontSize: '12px'},
        td: {padding: '12px 10px', borderBottom: '1px solid #1f2937', color: '#e0e7ff'},

        // Monitoring Console (Visible et Propre)
        monitorSection: {marginTop: '40px', background: '#111827', borderRadius: '12px', overflow: 'hidden', border: '1px solid #374151'},
        monitorHead: {background: '#1f2937', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'},
        monitorTitle: {color: '#007bff', fontWeight: 'bold', fontSize: '14px'},
        console: {padding: '15px', fontFamily: 'monospace', fontSize: '12px', color: '#00cc66', maxHeight: '180px', overflowY: 'auto'},
        statusDot: (status) => ({
            height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '8px',
            backgroundColor: status === 'SUCCESS' ? '#10b981' : status === 'CRITICAL_FAILURE' ? '#ef4444' : '#f59e0b'
        })
    };

    const getStatusColor = (status) => {
        if (status === 'SUCCESS') return '#10b981';
        if (status === 'WARNING_BACKUP' || status === 'WAITING') return '#f59e0b';
        if (status === 'CRITICAL_FAILURE') return '#ef4444';
        return '#6b7280';
    };

    return (
        <div style={styles.page}>
            {/* EN-TÊTE ET BOUTON ACTION */}
            <div style={styles.header}>
                <div>
                    <h1 style={{fontSize: '32px', fontWeight: '800', margin: 0, color: '#007bff'}}>OODA PIPELINE</h1>
                    <div style={{color: '#94a3b8', fontSize: '16px'}}>Analyse Territoriale & Électorale - Saint-André 2026</div>
                </div>
                <button onClick={refreshData} style={{background: '#007bff', border: 'none', color: 'white', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)', transition: 'background 0.3s'}}>
                    ACTUALISER LES DATAS
                </button>
            </div>

            {/* --- 1. INDICATEURS CLÉS & DYNAMIQUE SOCIALE --- */}
            <div style={styles.sectionTitle}>1. INDICATEURS CLÉS & TENDANCES</div>
            <div style={styles.grid}>
                {/* Carte Population (LIVE) */}
                <div style={{...styles.card, borderLeft: '4px solid #007bff'}}>
                    <div style={styles.cardLabel}>Population Officielle</div>
                    <div style={styles.cardValue}>{d.population_est || "-"}</div>
                    <div style={{...styles.cardSub, color: '#007bff'}}>Densité : {d.densite || "-"}</div>
                </div>
                {/* Carte Maire Actuel */}
                <div style={{...styles.card, borderLeft: '4px solid #10b981'}}>
                    <div style={styles.cardLabel}>Maire en Exercice</div>
                    <div style={styles.cardValue} style={{...styles.cardValue, color: '#10b981', fontSize: '24px'}}>{d.maire_actuel_nom || "-"}</div>
                    <div style={styles.cardSub}>Score 2020 : {d.maire_actuel_score || "-"}</div>
                </div>
                {/* Carte Taux de Chômage */}
                <div style={{...styles.card, borderLeft: '4px solid #f97316'}}>
                    <div style={styles.cardLabel}>Taux de Chômage</div>
                    <div style={styles.cardValue} style={{...styles.cardValue, color: '#f97316'}}>{d.taux_chomage || "-"}</div>
                    <div style={styles.cardSub}>Revenu Médian : {d.revenu_median || "-"}</div>
                </div>
                {/* Carte Abstention 2020 */}
                <div style={{...styles.card, borderLeft: '4px solid #ef4444'}}>
                    <div style={styles.cardLabel}>Abstention Municipale</div>
                    <div style={styles.cardValue} style={{...styles.cardValue, color: '#ef4444'}}>{d.abstention_mun_2020 || "-"}</div>
                    <div style={styles.cardSub}>Réserve de voix clé</div>
                </div>
            </div>

            {/* --- 2. ANALYSE SOCIOLOGIQUE & CLIMAT --- */}
            <div style={styles.sectionTitle}>2. FACTEURS GOUVERNANCE & QUALITÉ DE VIE</div>
            <div style={styles.grid}>
                {/* % Logement Social */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>% Logement Social (HLM)</div>
                    <div style={{...styles.cardValue, color: '#9333ea'}}>{d.logement_social_pct || "-"}</div>
                    <div style={styles.cardSub}>Taux Exonération : {d.taxe_exo_pct || "-"}</div>
                </div>
                {/* % Sans Diplôme */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>% Sans Diplôme (+15 ans)</div>
                    <div style={{...styles.cardValue, color: '#fcd34d'}}>{d.sans_diplome_pct || "-"}</div>
                    <div style={styles.cardSub}>Diplôme Sup. : {d.diplome_sup_pct || "-"}</div>
                </div>
                {/* Taux de Délinquance */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>Taux de Délinquance</div>
                    <div style={{...styles.cardValue, color: '#ef4444'}}>{d.taux_delinquance || "-"}</div>
                    <div style={styles.cardSub}>Climat social / Sécurité</div>
                </div>
                {/* Abstention Présidentielle */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>Abstention Présidentielle</div>
                    <div style={{...styles.cardValue, color: '#007bff'}}>{d.abstention_pres_2022 || "-"}</div>
                    <div style={styles.cardSub}>Espaces Verts : {d.espaces_verts_ha || "-"}</div>
                </div>
            </div>

            {/* --- 3. HISTORIQUE POLITIQUE (Tableau) --- */}
            <div style={styles.sectionTitle}>3. HISTORIQUE DES CYCLES MUNICIPAUX</div>
            <div style={{...styles.card, padding: '0'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '10%'}}>Année</th>
                            <th style={{...styles.th, width: '40%'}}>Vainqueur</th>
                            <th style={{...styles.th, width: '15%'}}>Parti</th>
                            <th style={{...styles.th, width: '15%'}}>Score</th>
                            <th style={{...styles.th, width: '20%'}}>Tension du Scrutin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {d.historique_maires ? d.historique_maires.map((m, i) => (
                            <tr key={i}>
                                <td style={{...styles.td, color: '#94a3b8', padding: '15px'}}>{m.annee}</td>
                                <td style={{...styles.td, fontWeight: 'bold', padding: '15px'}}>{m.vainqueur}</td>
                                <td style={{...styles.td, padding: '15px'}}>{m.parti}</td>
                                <td style={{...styles.td, padding: '15px'}}>{m.score}</td>
                                <td style={{...styles.td, color: m.ecart === 'Serré' ? '#f97316' : '#10b981', padding: '15px'}}>{m.ecart}</td>
                            </tr>
                        )) : <tr><td colSpan="5" style={{...styles.td, textAlign: 'center'}}>Chargement des données historiques...</td></tr>}
                    </tbody>
                </table>
            </div>


            {/* --- 4. CONSOLE DE CONTRÔLE TECHNIQUE (Monitoring) --- */}
            <div style={styles.monitorSection}>
                <div style={styles.monitorHead}>
                    <span style={styles.monitorTitle}>🛠️ CONSOLE DE CONTRÔLE TECHNIQUE</span>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={styles.statusDot(mon.status)}></span>
                        <span style={{color: 'white', fontWeight: 'bold'}}>Statut Pipeline: {mon.status || "UNKNOWN"}</span>
                        <span style={{marginLeft: '20px', color: '#94a3b8'}}>Dernière Exécution: {d.last_update || "N/A"}</span>
                    </div>
                </div>
                <div style={styles.console}>
                    {mon.execution_logs && mon.execution_logs.length > 0 ? (
                        mon.execution_logs.map((log, i) => <div key={i}>{log}</div>)
                    ) : (
                        <div style={{color:'#64748b'}}>En attente du premier rapport d'exécution complet. Lancez le /trigger-scrape.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
