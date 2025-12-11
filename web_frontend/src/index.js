import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './views/Dashboard';

// Style global minimal directement injecté (remplace l'ancien index.css manquant)
const style = document.createElement('style');
style.innerHTML = `
  body { 
    margin: 0; 
    font-family: system-ui, -apple-system, sans-serif; 
    -webkit-font-smoothing: antialiased; 
    background-color: #0a101a; /* Couleur de fond sombre du Dashboard V4 */
  }
  * { box-sizing: border-box; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
