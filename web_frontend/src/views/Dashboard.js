import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const load = async () => {
            const res = await fetchKpis();
            setData(res || {});
        };
        load();
    }, []);

    const d = data || {};
    
    // Style Système "Data Analyst"
    const styles = {
        bg: {background: '#0f172a', minHeight: '100vh', color: 'white', padding: '24px', fontFamily: 'Inter, sans-serif'},
        grid: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px'},
        card: {background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155'},
        label: {color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'},
        value: {fontSize: '28px', fontWeight: '700', color: '#f8fafc'},
        sub: {fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px'},
        sectionTitle: {fontSize: '18px', fontWeight: '600', color: '#e2e8f0', marginTop: '40px', marginBottom: '20px', borderLeft: '4px solid #3b82f6', paddingLeft: '10px'},
        table: {width: '100%', borderCollapse: 'collapse', fontSize: '14px'},
        th: {textAlign: 'left', color: '#64748b', padding: '10px', borderBottom: '1px solid #334155'},
        td: {padding: '10px', borderBottom: '1px solid #1e293b', color: '#cbd5e1'}
    };

    return (
        <div style={styles.bg}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
                <div>
                    <h1 style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>OODA SAINT-ANDRÉ</h1>
                    <div style={{color: '#64748b', fontSize: '14px'}}>Objectif Municipales 2026</div>
                </div>
                <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '12px', color: '#64748b'}}>Dernier Scan</div>
                    <div style={{color: '#10b981', fontWeight: 'bold'}}>{d.last_update || "En attente"}</div>
                </div>
            </div>

            {/* SOCIO-DEMOGRAPHIE (API GOUV) */}
            <div style={styles.sectionTitle}>1. TERRAIN & SOCIOLOGIE</div>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.label}>Population Totale</div>
                    <div style={styles.value}>{d.population_est || "-"}</div>
                    <div style={{...styles.sub, color: '#3b82f6'}}>Densité : {d.densite}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Taux de Chômage</div>
                    <div style={{...styles.value, color: '#f87171'}}>{d.taux_chomage || "-"}</div>
                    <div style={styles.sub}>Indicateur de précarité</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Jeunesse (-25 ans)</div>
                    <div style={styles.value}>{d.part_jeunes || "-"}</div>
                    <div style={styles.sub}>Cible électorale clé</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Revenu Médian</div>
                    <div style={styles.value}>{d.revenu_median || "-"}</div>
                </div>
            </div>

            {/* POLITIQUE */}
            <div style={styles.sectionTitle}>2. DYNAMIQUE POLITIQUE</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px'}}>
                <div style={styles.card}>
                    <div style={styles.label}>Maire Sortant</div>
                    <div style={styles.value}>{d.maire_actuel_nom || "-"}</div>
                    <div style={{...styles.sub, color: '#10b981', fontWeight: 'bold'}}>{d.maire_actuel_score}</div>
                    <div style={{marginTop: '15px', fontSize: '13px', color: '#94a3b8'}}>{d.tendance_2020}</div>
                </div>

                <div style={styles.card}>
                    <div style={styles.label}>Historique des Cycles</div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Année</th>
                                <th style={styles.th}>Vainqueur</th>
                                <th style={styles.th}>Étiquette</th>
                                <th style={styles.th}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.historique_maires ? d.historique_maires.map((m, i) => (
                                <tr key={i}>
                                    <td style={{...styles.td, color: '#64748b'}}>{m.annee}</td>
                                    <td style={{...styles.td, fontWeight: 'bold'}}>{m.vainqueur}</td>
                                    <td style={styles.td}>
                                        <span style={{padding: '2px 6px', borderRadius: '4px', background: m.parti === 'DVG' || m.parti === 'PCR' ? '#7f1d1d' : '#1e3a8a', color: 'white', fontSize: '10px'}}>
                                            {m.parti}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{m.score}</td>
                                </tr>
                            )) : <tr><td colSpan="4" style={styles.td}>Chargement...</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
