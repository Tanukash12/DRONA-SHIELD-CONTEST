import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Since the App component uses Tailwind and includes its own inline global styles,
// we just need a minimal setup here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
