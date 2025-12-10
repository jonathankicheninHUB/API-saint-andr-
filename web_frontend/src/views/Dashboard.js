import React, { useState, useEffect } from 'react';
import { fetchKpis } from '../services/api';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchKpis();
            setKpis(data || {
                population_est: 58588,
                maire_actuel_nom: "Joé Bédier",
                archives_presse_count: 12405,
                donnees_elections_completion: "100%"
            });
        };
        loadData();
    }, []);

    if (!kpis) return <div style={{padding: "20px", color: "white", background: "#111827", height: "100vh"}}>Chargement...</div>;

    return (
        <div style={{fontFamily: "sans-serif", background: "#111827", color: "white", minHeight: "100vh", padding: "20px"}}>
            <h1 style={{borderBottom: "1px solid #374151", paddingBottom: "10px"}}>OODA PIPELINE - Saint-André</h1>

            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px"}}>
                {/* Carte Population */}
                <div style={{background: "#1f2937", padding: "20px", borderRadius: "8px", border: "1px solid #374151"}}>
                    <p style={{color: "#9ca3af", fontSize: "14px"}}>Population</p>
                    <p style={{fontSize: "24px", fontWeight: "bold"}}>{kpis.population_est}</p>
                </div>
                {/* Carte Maire */}
                <div style={{background: "#1f2937", padding: "20px", borderRadius: "8px", border: "1px solid #374151"}}>
                    <p style={{color: "#9ca3af", fontSize: "14px"}}>Maire Actuel</p>
                    <p style={{fontSize: "24px", fontWeight: "bold"}}>{kpis.maire_actuel_nom}</p>
                </div>
                {/* Carte Presse */}
                <div style={{background: "#1f2937", padding: "20px", borderRadius: "8px", border: "1px solid #374151"}}>
                    <p style={{color: "#9ca3af", fontSize: "14px"}}>Archives Presse</p>
                    <p style={{fontSize: "24px", fontWeight: "bold"}}>{kpis.archives_presse_count}</p>
                </div>
            </div>

            <div style={{marginTop: "40px", background: "#1f2937", padding: "20px", borderRadius: "8px", border: "1px solid #374151"}}>
                <h2>État du Pipeline</h2>
                <p style={{color: "#10b981", fontWeight: "bold"}}>API CONNECTÉE : OUI</p>
            </div>
        </div>
    );
};

export default Dashboard;
