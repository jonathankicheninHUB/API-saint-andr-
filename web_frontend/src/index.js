import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './views/Dashboard';
import './index.css'; 

// Création d'un style global minimal pour éviter les erreurs si index.css manque
const style = document.createElement('style');
style.innerHTML = `body { margin: 0; font-family: sans-serif; -webkit-font-smoothing: antialiased; }`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
