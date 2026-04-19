const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes        = require('./src/routes/auth.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const accountRoutes     = require('./src/routes/account.routes');
const setupSwagger      = require('./src/config/swagger');

const app = express();

// ── Swagger Documentation ───────────────────────────────────────────
setupSwagger(app);

// ── Middlewares globaux ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts',     accountRoutes);

// Route racine (sanity check)
app.get('/', (req, res) => {
  res.json({ message: 'API Bancaire ICT304 — OK' });
});

// ── Middleware de gestion d'erreurs global ───────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ statut: 'error', message: 'Erreur interne du serveur.' });
});

// ── Démarrage du serveur ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅  Serveur démarré sur http://localhost:${PORT}`);
});
