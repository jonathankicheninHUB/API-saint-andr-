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
        // Optionnel : Rafraîchir toutes les 30 minutes pour avoir les données live
        const interval = setInterval(refreshData, 1800000); 
        return () => clearInterval(interval);
    }, []);

    const d = data || {};
    // Récupération des logs techniques
    const mon = d.system_monitoring || { status: 'UNKNOWN', execution_logs: [], last_run: 'Aucune donnée' };

    // Styles (Design System V3 - Dark Analyst)
    const styles = {
        page: {background: '#0a101a', minHeight: '100vh', color: '#e0e7ff', padding: '30px', fontFamily: 'system-ui, sans-serif'},
        header: {borderBottom: '1px solid #1e293b', paddingBottom: '25px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'},
        
        // Grille générale
        grid: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '25px'},
        
        // Carte Standard
        card: {background: '#1a202c', padding: '25px', borderRadius: '10px', border: '1px solid #334155', transition: 'transform 0.2s', cursor: 'default'},
        cardLabel: {color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px'},
        cardValue: {fontSize: '36px', fontWeight: '700', color: '#fff', lineHeight: 1},
        cardSub: {fontSize: '14px', marginTop: '8px'},
        
        // Titres de Section
        sectionTitle: {fontSize: '22px', fontWeight: '600', color: '#ffffff', marginTop: '40px', marginBottom: '20px', borderLeft: '5px solid #007bff', paddingLeft: '15px'},
        
        // Monitoring Console
        monitorSection: {marginTop: '60px', background: '#111827', borderRadius: '12px', overflow: 'hidden'},
        monitorHead: {background: '#2563eb', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'},
        console: {padding: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#00cc66', maxHeight: '200px', overflowY: 'auto', background: '#000000'},
        statusDot: (status) => ({
            height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '8px',
            backgroundColor: status === 'SUCCESS' ? '#10b981' : status === 'CRITICAL_FAILURE' ? '#ef4444' : '#f59e0b'
        })
    };

    return (
        <div style={styles.page}>
            {/* EN-TÊTE ET CONTRÔLE */}
            <div style={styles.header}>
                <div>
                    <h1 style={{fontSize: '28px', fontWeight: '800', margin: 0, color: '#007bff'}}>OODA PIPELINE</h1>
                    <div style={{color: '#94a3b8', fontSize: '16px'}}>Analyse Électorale & Territoriale - Saint-André 2026</div>
                </div>
                <button onClick={refreshData} style={{background: '#007bff', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)'}}>
                    Rafraîchir les Données
                </button>
            </div>

            {/* --- 1. INDICATEURS CLÉS & DÉMOGRAPHIE --- */}
            <div style={styles.sectionTitle}>1. VUE D'ENSEMBLE & DYNAMIQUE SOCIALE</div>
            <div style={styles.grid}>
                {/* Carte Population (LIVE) */}
                <div style={{...styles.card, borderLeft: '5px solid #007bff'}}>
                    <div style={styles.cardLabel}>Population (INSEE)</div>
                    <div style={styles.cardValue}>{d.population_est || "-"}</div>
                    <div style={styles.cardSub}>Densité : {d.densite || "-"}</div>
                </div>
                {/* Carte Maire Actuel */}
                <div style={{...styles.card, borderLeft: '5px solid #10b981'}}>
                    <div style={styles.cardLabel}>Maire en Exercice</div>
                    <div style={styles.cardValue} style={{...styles.cardValue, color: '#10b981'}}>{d.maire_actuel_nom || "-"}</div>
                    <div style={styles.cardSub}>Score 2020 : {d.maire_actuel_score || "-"}</div>
                </div>
                {/* Carte Taux de Chômage */}
                <div style={{...styles.card, borderLeft: '5px solid #f97316'}}>
                    <div style={styles.cardLabel}>Taux de Chômage</div>
                    <div style={styles.cardValue} style={{...styles.cardValue, color: '#f97316'}}>{d.taux_chomage || "-"}</div>
                    <div style={styles.cardSub}>Revenu Médian : {d.revenu_median || "-"}</div>
                </div>
                {/* Carte Abstention 2020 */}
                <div style={{...styles.card, borderLeft: '5px solid #ef4444'}}>
                    <div style={styles.cardLabel}>Abstention Mun. 2020</div>
                    <div style={styles.cardValue} style={{...styles.cardValue, color: '#ef4444'}}>{d.abstention_mun_2020 || "-"}</div>
                    <div style={styles.cardSub}>Réserve de voix pour 2026</div>
                </div>
            </div>

            {/* --- 2. ANALYSE SOCIOLOGIQUE & CLIMAT --- */}
            <div style={styles.sectionTitle}>2. FACTEURS CLÉS (Éducation, Logement, Sécurité)</div>
            <div style={styles.grid}>
                {/* % Sans Diplôme */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>% Sans Diplôme</div>
                    <div style={{...styles.cardValue, color: '#fcd34d'}}>{d.sans_diplome_pct || "-"}</div>
                    <div style={styles.cardSub}>Diplôme Sup. : {d.diplome_sup_pct || "-"}</div>
                </div>
                {/* % Logement Social */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>% Logement Social (HLM)</div>
                    <div style={{...styles.cardValue, color: '#9333ea'}}>{d.logement_social_pct || "-"}</div>
                    <div style={styles.cardSub}>% Taxe Exo. : {d.taxe_exo_pct || "-"}</div>
                </div>
                {/* Taux de Délinquance */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>Taux de Délinquance</div>
                    <div style={{...styles.cardValue, color: '#ef4444'}}>{d.taux_delinquance || "-"}</div>
                    <div style={styles.cardSub}>Qualité de Vie (Sécurité)</div>
                </div>
                {/* Espaces Verts */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>Espaces Verts</div>
                    <div style={{...styles.cardValue, color: '#10b981'}}>{d.espaces_verts_ha || "-"}</div>
                    <div style={styles.cardSub}>Superficie : {d.surface || "-"}</div>
                </div>
            </div>

            {/* --- 3. HISTORIQUE POLITIQUE --- */}
            <div style={styles.sectionTitle}>3. HISTORIQUE DES CYCLES MUNICIPAUX</div>
            <div style={{...styles.card, background: '#1a202c', padding: '0'}}>
                <table style={{...styles.table, width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{background: '#1a202c'}}>
                            <th style={{...styles.th, width: '10%'}}>Année</th>
                            <th style={{...styles.th, width: '40%'}}>Vainqueur</th>
                            <th style={{...styles.th, width: '15%'}}>Parti</th>
                            <th style={{...styles.th, width: '15%'}}>Score</th>
                            <th style={{...styles.th, width: '20%'}}>Tension du Scrutin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {d.historique_maires ? d.historique_maires.map((m, i) => (
                            <tr key={i} style={{borderTop: '1px solid #334155'}}>
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
                    <span style={{fontWeight: 'bold'}}>🛠️ CONSOLE DE CONTRÔLE TECHNIQUE</span>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={styles.statusDot(mon.status)}></span>
                        Statut Pipeline: **{mon.status || "UNKNOWN"}** | Dernière Exécution: {d.last_update || "N/A"}
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

            <div style={{textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#475569'}}>
                Data OSINT (Open Source Intelligence) - Pipeline Render/Vercel/Drive - {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default Dashboard;
