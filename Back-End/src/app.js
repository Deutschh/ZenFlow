// src/app.js

const express = require('express');
require('dotenv').config();
const cors = require('cors');

// 1. IMPORTAR ROTAS
const authRoutes = require('./api/auth/auth.routes');
// const storeRoutes = require('./api/stores/stores.routes'); // Descomentei, pois deve existir
const subscriptionRoutes = require('./api/subscription/subscription.routes');

// 2. CRIAR O APP (Agora ele existe!)
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARES (Configurações globais)
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] // Aceita ambas as origens do Vite
};
app.use(cors(corsOptions));
app.use(express.json());

// 4. USAR AS ROTAS (Agora que temos middlewares configurados)
app.use('/api/auth', authRoutes);
// app.use('/api/stores', storeRoutes); // Se o arquivo existir, mantenha descomentado
app.use('/api/subscription', subscriptionRoutes);

// 5. INICIAR O SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor ZenFlow rodando na porta http://localhost:${PORT}`);
});