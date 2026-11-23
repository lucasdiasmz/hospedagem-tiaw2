import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ds/preferencias.js';
import '@ds/acessamob.css';
import './styles/cadastro-medicamentos.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
