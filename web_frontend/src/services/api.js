import axios from 'axios';

// Voici l'URL de votre API Render qui fonctionne
const API_BASE_URL = 'https://api-saint-andr.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchKpis = async () => {
    try {
        const response = await api.get('/kpis');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const fetchBureauxDeVote = async (annee) => {
    try {
        const response = await api.get(`/bureaux-de-vote/${annee}`);
        return response.data;
    } catch (error) {
        return [];
    }
};
