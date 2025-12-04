import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener('load', () => {
  // Hide the loader once everything is loaded
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', () => loader.remove());
  }
  
  // Service Worker registration is disabled to prevent "origin mismatch" errors 
  // in the AI Studio preview environment. 
  // The preview environment often redirects missing static files or serves them 
  // from a different origin, causing Service Worker registration to fail.
  
  /*
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  }
  */
});