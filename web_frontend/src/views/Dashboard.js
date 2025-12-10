import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchKpis();
                setKpis(data || {});
            } catch (e) { console.error(e); }
        };
        loadData();
    }, []);

    // Données par défaut (Design Maquette) si l'API est vide
    const d = kpis || {};
    const pop = d.population_est || "58,588";
    const maire = d.maire_actuel_nom || "Joé Bédier";
    const presse = d.archives_presse_count || "12,405";
    const elec = d.donnees_elections_completion || "100%";

    return (
        <div style={{backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px'}}>
            {/* En-tête */}
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px'}}>
                <h1 style={{margin: 0, fontSize: '24px'}}>Tableau de Bord <span style={{fontSize:'12px', background:'#1e293b', padding:'4px 8px', borderRadius:'4px', color:'#94a3b8', border:'1px solid #475569'}}>ENV: PRODUCTION</span></h1>
                <div style={{textAlign:'right', fontSize:'12px', color:'#94a3b8'}}>OODA PIPELINE<br/>Saint-André 1976-2026</div>
            </div>

            {/* Cartes KPI */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px'}}>
                <Card title="Population (Est. 2025)" value={pop} sub="+3.45% vs 2016" subColor="#10b981" />
                <Card title="Maire Actuel" value={maire} sub="Élu en 2020 (52.16%)" subColor="#3b82f6" />
                <Card title="Archives Presse" value={presse} sub="Articles JIR/Clicanoo indexés" subColor="#9ca3af" />
                <Card title="Données Élections" value={elec} sub="1976-2020 complet" subColor="#10b981" />
            </div>

            {/* Section Principale */}
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px'}}>
                {/* Carte */}
                <div style={{backgroundColor: '#1e293b', borderRadius: '10px', padding: '20px', border: '1px solid #334155', minHeight: '400px'}}>
                    <h3 style={{margin: '0 0 15px 0'}}>Couverture Bureaux de Vote</h3>
                    <div style={{height: '350px', background: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #475569', color: '#64748b'}}>
                        CARTE INTERACTIVE (Données GPS en cours de chargement...)
                    </div>
                </div>

                {/* Pipeline */}
                <div style={{backgroundColor: '#1e293b', borderRadius: '10px', padding: '20px', border: '1px solid #334155'}}>
                    <h3 style={{margin: '0 0 20px 0'}}>État du Pipeline</h3>
                    <PipelineRow name="SCRAPING (INSEE)" status="PRÊT" color="#10b981" width="100%" />
                    <PipelineRow name="PRESSE (JIR)" status="EN ATTENTE" color="#f59e0b" width="60%" />
                    <PipelineRow name="NORMALISATION" status="IDLE" color="#334155" width="0%" />
                    
                    <button style={{width: '100%', marginTop: '30px', background: '#6366f1', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
                        📥 Télécharger le Pack (.zip)
                    </button>
                </div>
            </div>
        </div>
    );
};

// Petits composants pour le design
const Card = ({title, value, sub, subColor}) => (
    <div style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155'}}>
        <div style={{color: '#9ca3af', fontSize: '14px', marginBottom: '5px'}}>{title}</div>
        <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '5px'}}>{value}</div>
        <div style={{color: subColor, fontSize: '13px'}}>{sub}</div>
    </div>
);

const PipelineRow = ({name, status, color, width}) => (
    <div style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px'}}>
            <span>{name}</span>
            <span style={{color: color, fontWeight: 'bold'}}>{status}</span>
        </div>
        <div style={{height: '6px', background: '#334155', borderRadius: '3px'}}>
            <div style={{height: '100%', width: width, background: color, borderRadius: '3px'}}></div>
        </div>
    </div>
);

export default Dashboard;
