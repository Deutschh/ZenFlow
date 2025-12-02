// Em: src/main.jsx

import React from "react"; // (Boa prática importar o React)
import { createRoot } from "react-dom/client"; // <-- Sua importação correta
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// CORREÇÃO: Remova o 'ReactDOM.'
// Use a função 'createRoot' diretamente.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
