const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Générer un numéro de compte unique
function genererNumeroCompte() {
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  return `ACC-${rand}`;
}

// POST /api/auth/register
exports.register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ statut: 'error', message: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Vérifier si l'email existe déjà
    const [existant] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existant.length > 0) {
      return res.status(400).json({ statut: 'error', message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    const hash = await bcrypt.hash(mot_de_passe, 10);

    // Créer l'utilisateur
    const [result] = await db.query(
      'INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, hash, role || 'client']
    );
    const userId = result.insertId;

    // Créer automatiquement un compte bancaire lié
    const numeroCompte = genererNumeroCompte();
    await db.query(
      'INSERT INTO comptes (numero_compte, user_id, solde) VALUES (?, ?, ?)',
      [numeroCompte, userId, 0.00]
    );

    res.status(201).json({
      statut: 'success',
      message: 'Compte créé avec succès.',
      user_id: userId,
      numero_compte: numeroCompte,
    });
  } catch (err) {
    res.status(500).json({ statut: 'error', message: 'Erreur serveur.', detail: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ statut: 'error', message: 'Email et mot de passe requis.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND actif = 1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ statut: 'error', message: 'Email ou mot de passe incorrect.' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!valid) {
      return res.status(401).json({ statut: 'error', message: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      statut: 'success',
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ statut: 'error', message: 'Erreur serveur.', detail: err.message });
  }
};
