
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Note: Global styles from index.html (Tailwind, fonts, custom palette) apply to the whole app.

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
