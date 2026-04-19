const db = require('../config/db');

// GET /api/accounts
exports.listAllAccounts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM comptes');
    
    res.status(200).json({
      statut: 'success',
      donnees: rows,
      total: rows.length
    });
  } catch (err) {
    res.status(500).json({ 
      statut: 'error', 
      message: 'Erreur lors de la récupération des comptes.', 
      detail: err.message 
    });
  }
};
