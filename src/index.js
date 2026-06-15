import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React busca el elemento con id 'root' que está en public/index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Error: No se encontró el elemento con id 'root' en public/index.html");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}