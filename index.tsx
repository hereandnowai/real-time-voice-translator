
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Explicitly add .tsx extension for browser ES module resolution

// Ensure the root element exists before attempting to create a root.
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