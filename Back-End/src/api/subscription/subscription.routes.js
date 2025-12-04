// src/api/subscription/subscription.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./subscription.controller');
const checkAuth = require('../middleware/auth.middleware'); // Proteção

// Rota POST protegida para selecionar o plano
router.post('/select', checkAuth, controller.selectPlan);

module.exports = router;