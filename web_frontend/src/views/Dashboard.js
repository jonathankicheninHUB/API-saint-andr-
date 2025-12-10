import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        try {
            const res = await fetchKpis();
            setData(res || {});
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const d = data || {};
    // Récupération des logs techniques générés par le Pipeline
    const mon = d.system_monitoring || { status: 'UNKNOWN', logs: [], last_run: 'Aucune donnée' };

    const styles = {
        page: {background: '#0f172a', minHeight: '100vh', color: 'white', padding: '24px', fontFamily: 'Inter, sans-serif'},
        header: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px'},
        
        // Style Cartes Data
        grid: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px'},
        card: {background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155'},
        label: {color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'},
        value: {fontSize: '28px', fontWeight: '700', color: '#f8fafc'},
        sub: {fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px'},
        
        // Style Tableaux
        table: {width: '100%', borderCollapse: 'collapse', fontSize: '14px'},
        th: {textAlign: 'left', color: '#64748b', padding: '10px', borderBottom: '1px solid #334155'},
        td: {padding: '10px', borderBottom: '1px solid #1e293b', color: '#cbd5e1'},

        // Style Monitoring (Les Outils de Contrôle)
        monitorSection: {marginTop: '60px', background: '#111827', border: '1px solid #ef4444', borderRadius: '12px', padding: '0', overflow: 'hidden'},
        monitorHead: {background: 'rgba(239, 68, 68, 0.1)', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ef4444'},
        monitorTitle: {color: '#ef4444', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px'},
        console: {padding: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#22c55e', maxHeight: '200px', overflowY: 'auto'},
        logLine: {marginBottom: '5px', borderBottom: '1px dashed #374151', paddingBottom: '2px'}
    };

    return (
        <div style={styles.page}>
            {/* EN-TÊTE */}
            <div style={styles.header}>
                <div>
                    <h1 style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>OODA SAINT-ANDRÉ</h1>
                    <div style={{color: '#64748b', fontSize: '14px'}}>Intelligence Électorale & Territoriale</div>
                </div>
                <button onClick={refreshData} style={{background: '#2563eb', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
                    Actualiser les Données
                </button>
            </div>

            {/* --- BLOC DATA (Ce qu'on montre au client) --- */}
            <h3 style={{color:'#e2e8f0', fontSize:'18px', marginBottom:'20px', borderLeft:'4px solid #3b82f6', paddingLeft:'10px'}}>1. ANALYSE TERRITORIALE (OSINT)</h3>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.label}>Population Totale</div>
                    <div style={styles.value}>{d.population_est || "-"}</div>
                    <div style={{...styles.sub, color: '#3b82f6'}}>Densité : {d.densite}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Taux de Chômage</div>
                    <div style={{...styles.value, color: '#f87171'}}>{d.taux_chomage || "-"}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Maire Sortant</div>
                    <div style={styles.value}>{d.maire_actuel_nom || "-"}</div>
                    <div style={{...styles.sub, color: '#10b981'}}>{d.maire_actuel_score}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Dernière Mise à Jour</div>
                    <div style={{...styles.value, fontSize:'20px'}}>{d.last_update || "En attente"}</div>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                <div style={styles.card}>
                    <div style={styles.label}>Historique Politique</div>
                    <table style={styles.table}>
                        <thead><tr><th>Année</th><th>Vainqueur</th><th>Score</th></tr></thead>
                        <tbody>
                            {d.historique_maires ? d.historique_maires.map((m, i) => (
                                <tr key={i}><td style={styles.td}>{m.annee}</td><td style={{...styles.td, fontWeight:'bold'}}>{m.vainqueur}</td><td style={styles.td}>{m.score}</td></tr>
                            )) : <tr><td colSpan="3" style={styles.td}>Chargement...</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BLOC CONTRÔLE (Vos outils techniques) --- */}
            <div style={styles.monitorSection}>
                <div style={styles.monitorHead}>
                    <span style={styles.monitorTitle}>🛠️ ZONE DE CONTRÔLE TECHNIQUE</span>
                    <div style={{fontSize: '12px', display:'flex', gap:'15px'}}>
                        <span>STATUT: <strong style={{color: mon.status === 'SUCCESS' ? '#10b981' : '#ef4444'}}>{mon.status}</strong></span>
                        <span>ITEMS: <strong>{mon.items_count || 0}</strong></span>
                        <span>DURÉE: <strong>{mon.duration_seconds ? mon.duration_seconds.toFixed(2) : 0}s</strong></span>
                    </div>
                </div>
                <div style={styles.console}>
                    <div style={{color: '#9ca3af', marginBottom: '10px'}}>// Journal d'exécution du Robot (Logs Drive)</div>
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
