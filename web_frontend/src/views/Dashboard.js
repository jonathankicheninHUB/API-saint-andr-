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
    }, []);

    const d = data || {};
    // Récupération des logs techniques générés par le Pipeline
    const mon = d.system_monitoring || { status: 'UNKNOWN', logs: [], last_run: 'Aucune donnée' };

    // Styles (Dark Mode Pro)
    const styles = {
        page: {background: '#0f172a', minHeight: '100vh', color: 'white', padding: '24px', fontFamily: 'Inter, sans-serif'},
        header: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px'},
        
        grid: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px'},
        card: {background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155'},
        label: {color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'},
        value: {fontSize: '28px', fontWeight: '700', color: '#f8fafc'},
        sub: {fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px'},
        sectionTitle: {fontSize: '18px', fontWeight: '600', color: '#e2e8f0', marginTop: '40px', marginBottom: '20px', borderLeft: '4px solid #3b82f6', paddingLeft: '10px'},
        
        table: {width: '100%', borderCollapse: 'collapse', fontSize: '14px'},
        th: {textAlign: 'left', color: '#64748b', padding: '10px', borderBottom: '1px solid #334155'},
        td: {padding: '10px', borderBottom: '1px solid #1e293b', color: '#cbd5e1'},

        // Style Monitoring (Console)
        monitorSection: {marginTop: '60px', background: '#111827', border: '1px solid #334155', borderRadius: '12px', padding: '0', overflow: 'hidden'},
        monitorHead: {background: '#1e293b', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155'},
        monitorTitle: {color: '#94a3b8', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px'},
        console: {padding: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#22c55e', maxHeight: '200px', overflowY: 'auto'},
        logLine: {marginBottom: '5px', borderBottom: '1px dashed #374151', paddingBottom: '2px'}
    };

    // Fonctions d'aide (ex: couleur du statut)
    const getStatusColor = (status) => {
        if (status === 'SUCCESS') return '#10b981';
        if (status === 'WARNING_BACKUP' || status === 'WAITING') return '#f59e0b';
        if (status === 'CRITICAL_FAILURE') return '#ef4444';
        return '#6b7280';
    };

    return (
        <div style={styles.page}>
            {/* EN-TÊTE */}
            <div style={styles.header}>
                <div>
                    <h1 style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>OODA SAINT-ANDRÉ</h1>
                    <div style={{color: '#64748b', fontSize: '14px'}}>Data Intelligence Municipale 2026</div>
                </div>
                <button onClick={refreshData} style={{background: '#2563eb', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
                    Actualiser les Données
                </button>
            </div>

            {/* --- SECTION 1 : SOCIO-DÉMOGRAPHIE (API GOUV / INSEE) --- */}
            <div style={styles.sectionTitle}>1. SOCIO-DÉMOGRAPHIE & ÉCONOMIE</div>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.label}>Population Totale</div>
                    <div style={styles.value}>{d.population_est || "-"}</div>
                    <div style={{...styles.sub, color: '#3b82f6'}}>Densité : {d.densite}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Taux de Chômage</div>
                    <div style={{...styles.value, color: '#f87171'}}>{d.taux_chomage || "-"}</div>
                    <div style={styles.sub}>Revenu Médian : {d.revenu_median}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>% Jeunesse (-25 ans)</div>
                    <div style={styles.value}>{d.part_jeunes || "-"}</div>
                    <div style={styles.sub}>Base électorale volatile</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Superficie Totale</div>
                    <div style={styles.value}>{d.surface || "-"}</div>
                    <div style={styles.sub}>Espaces Verts : {d.espaces_verts_ha}</div>
                </div>
            </div>

            {/* --- SECTION 2 : ÉDUCATION & CONDITIONS DE VIE --- */}
            <div style={styles.sectionTitle}>2. ÉDUCATION & CONDITIONS DE VIE</div>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.label}>% Sans Diplôme</div>
                    <div style={{...styles.value, color: '#fcd34d'}}>{d.sans_diplome_pct || "-"}</div>
                    <div style={styles.sub}>Indicateur social clé</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>% Diplôme Supérieur</div>
                    <div style={{...styles.value, color: '#60a5fa'}}>{d.diplome_sup_pct || "-"}</div>
                    <div style={styles.sub}>Catégories Socio-Pro</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>% Logement Social (HLM)</div>
                    <div style={styles.value}>{d.logement_social_pct || "-"}</div>
                    <div style={styles.sub}>Taxe Exo. : {d.taxe_exo_pct}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Taux de Délinquance</div>
                    <div style={{...styles.value, color: '#ef4444'}}>{d.taux_delinquance || "-"}</div>
                    <div style={styles.sub}>Sentiment d'insécurité</div>
                </div>
            </div>

            {/* --- SECTION 3 : DYNAMIQUE POLITIQUE & ABSTENTION --- */}
            <div style={styles.sectionTitle}>3. DYNAMIQUE POLITIQUE & ABSTENTION</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px'}}>
                <div style={styles.card}>
                    <div style={styles.label}>Maire Sortant</div>
                    <div style={styles.value}>{d.maire_actuel_nom || "-"}</div>
                    <div style={{...styles.sub, color: '#10b981', fontWeight: 'bold'}}>{d.maire_actuel_score}</div>
                    <div style={{marginTop: '15px', fontSize: '13px', color: '#94a3b8'}}>{d.tendance_2020}</div>
                    
                    <div style={{...styles.label, marginTop: '20px'}}>Réserves de voix</div>
                    <div style={{fontSize:'16px', fontWeight:'bold', color: '#f7ad71'}}>{d.abstention_mun_2020}</div>
                    <div style={styles.sub}>Abstention Mun. 2020</div>
                    <div style={{fontSize:'16px', fontWeight:'bold', color: '#f7ad71', marginTop: '10px'}}>{d.abstention_pres_2022}</div>
                    <div style={styles.sub}>Abstention Pres. 2022</div>
                </div>

                <div style={styles.card}>
                    <div style={styles.label}>Historique des Mandats</div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Année</th>
                                <th style={styles.th}>Vainqueur</th>
                                <th style={styles.th}>Score</th>
                                <th style={styles.th}>Écart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.historique_maires ? d.historique_maires.map((m, i) => (
                                <tr key={i}>
                                    <td style={{...styles.td, color: '#64748b'}}>{m.annee}</td>
                                    <td style={{...styles.td, fontWeight: 'bold'}}>{m.vainqueur}</td>
                                    <td style={styles.td}>{m.score}</td>
                                    <td style={styles.td}>{m.ecart}</td>
                                </tr>
                            )) : <tr><td colSpan="4" style={styles.td}>Chargement...</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* --- BLOC 4 : CONTRÔLE TECHNIQUE (Console) --- */}
            <div style={styles.monitorSection}>
                <div style={styles.monitorHead}>
                    <span style={styles.monitorTitle}>🛠️ CONSOLE DE CONTRÔLE TECHNIQUE | DERNIÈRE MAJ : {mon.last_run}</span>
                    <span style={{fontSize: '12px', color: getStatusColor(mon.status)}}>STATUT : {mon.status}</span>
                </div>
                <div style={styles.console}>
                    {mon.execution_logs && mon.execution_logs.length > 0 ? (
                        mon.execution_logs.map((log, i) => <div key={i} style={styles.logLine}>{`> ${log}`}</div>)
                    ) : (
                        <div style={{color:'#6b7280'}}>En attente du prochain rapport d'exécution...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
