import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        try {
            const result = await fetchKpis();
            setData(result || {});
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Sécurisation des données pour éviter le crash si vide
    const kpi = data || {};
    const mon = data?.monitoring || { status: 'UNKNOWN', logs: [] };

    // Styles (Design System Dark OODA)
    const styles = {
        page: { backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, sans-serif', padding: '24px' },
        header: { borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        h1: { fontSize: '24px', fontWeight: '700', margin: 0 },
        tag: { fontSize: '11px', backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#94a3b8', border: '1px solid #475569', marginLeft: '10px' },
        
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
        card: { backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', position: 'relative' },
        label: { fontSize: '13px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
        value: { fontSize: '32px', fontWeight: '700', color: '#fff' },
        sub: { fontSize: '13px', marginTop: '4px' },
        
        monitorSection: { backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '24px', marginTop: '40px' },
        monitorHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
        statusDot: (status) => ({
            height: '10px', width: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '8px',
            backgroundColor: status === 'SUCCESS' ? '#10b981' : status === 'CRITICAL_FAILURE' ? '#ef4444' : '#64748b'
        }),
        console: { backgroundColor: '#000', color: '#22c55e', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', height: '150px', overflowY: 'auto' }
    };

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.h1}>OODA PIPELINE <span style={styles.tag}>SAINT-ANDRÉ</span></h1>
                </div>
                <button onClick={refreshData} style={{background: '#2563eb', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'}}>
                    Actualiser
                </button>
            </div>

            {/* KPIs */}
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.label}>Population</div>
                    <div style={styles.value}>{kpi.population_est || "..."}</div>
                    <div style={{...styles.sub, color: '#10b981'}}>{kpi.evolution}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Maire Actuel</div>
                    <div style={styles.value}>{kpi.maire_actuel_nom || "..."}</div>
                    <div style={{...styles.sub, color: '#3b82f6'}}>{kpi.maire_actuel_score}</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Archives Presse</div>
                    <div style={styles.value}>{kpi.archives_presse_count || "0"}</div>
                    <div style={{...styles.sub, color: '#94a3b8'}}>Indexés</div>
                </div>
                <div style={styles.card}>
                    <div style={styles.label}>Données Électorales</div>
                    <div style={styles.value}>{kpi.donnees_elections_completion || "0%"}</div>
                    <div style={{...styles.sub, color: '#10b981'}}>1976-2020</div>
                </div>
            </div>

            {/* Monitoring Console */}
            <div style={styles.monitorSection}>
                <div style={styles.monitorHeader}>
                    <h3 style={{margin: 0, fontSize: '16px'}}>📡 Console de Monitoring</h3>
                    <div style={{fontSize: '14px', display: 'flex', alignItems: 'center'}}>
                        <span style={styles.statusDot(mon.status)}></span>
                        {mon.status || "WAITING"} | Dernière exécution : {mon.last_execution || "Aucune"}
                    </div>
                </div>
                
                {/* Console Log View */}
                <div style={styles.console}>
                    {mon.execution_logs && mon.execution_logs.length > 0 ? (
                        mon.execution_logs.map((log, i) => <div key={i}>{`> ${log}`}</div>)
                    ) : (
                        <div>Waiting for system logs...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
