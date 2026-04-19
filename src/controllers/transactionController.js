const db = require('../config/db');

// POST /api/transactions/depot
exports.depot = async (req, res) => {
  const { compte_id, montant, description } = req.body;

  // Validation de base
  if (!compte_id || !montant) {
    return res.status(400).json({ statut: 'error', message: 'compte_id et montant sont obligatoires.' });
  }
  if (isNaN(montant) || Number(montant) <= 0) {
    return res.status(400).json({ statut: 'error', message: 'Le montant doit être un nombre positif.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Vérifier que le compte existe et appartient à l'utilisateur connecté
    const [comptes] = await conn.query(
      'SELECT * FROM comptes WHERE id = ? AND user_id = ? AND actif = 1',
      [compte_id, req.user.id]
    );
    if (comptes.length === 0) {
      await conn.rollback();
      return res.status(404).json({ statut: 'error', message: 'Compte introuvable.' });
    }

    const compte = comptes[0];

    // Créditer le compte
    await conn.query(
      'UPDATE comptes SET solde = solde + ? WHERE id = ?',
      [montant, compte_id]
    );

    // Enregistrer la transaction
    const [result] = await conn.query(
      'INSERT INTO transactions (type, montant, devise, compte_id, description, statut) VALUES (?, ?, ?, ?, ?, ?)',
      ['depot', montant, compte.devise, compte_id, description || 'Dépôt', 'success']
    );

    // Lire le nouveau solde
    const [updated] = await conn.query('SELECT solde FROM comptes WHERE id = ?', [compte_id]);

    await conn.commit();

    res.status(200).json({
      statut: 'success',
      message: 'Dépôt effectué avec succès.',
      transaction_id: result.insertId,
      nouveau_solde: parseFloat(updated[0].solde),
      devise: compte.devise,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ statut: 'error', message: 'Erreur serveur.', detail: err.message });
  } finally {
    conn.release();
  }
};

// POST /api/transactions/retrait
exports.retrait = async (req, res) => {
  const { compte_id, montant, description } = req.body;

  // Validation de base
  if (!compte_id || !montant) {
    return res.status(400).json({ statut: 'error', message: 'compte_id et montant sont obligatoires.' });
  }
  if (isNaN(montant) || Number(montant) <= 0) {
    return res.status(400).json({ statut: 'error', message: 'Le montant doit être un nombre positif.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Vérifier que le compte existe et appartient à l'utilisateur connecté
    const [comptes] = await conn.query(
      'SELECT * FROM comptes WHERE id = ? AND user_id = ? AND actif = 1',
      [compte_id, req.user.id]
    );
    if (comptes.length === 0) {
      await conn.rollback();
      return res.status(404).json({ statut: 'error', message: 'Compte introuvable.' });
    }

    const compte = comptes[0];

    // Vérifier le solde
    if (parseFloat(compte.solde) < Number(montant)) {
      await conn.rollback();
      return res.status(400).json({
        statut: 'error',
        message: 'Solde insuffisant.',
        solde_disponible: parseFloat(compte.solde),
        montant_demande: Number(montant),
      });
    }

    // Débiter le compte
    await conn.query(
      'UPDATE comptes SET solde = solde - ? WHERE id = ?',
      [montant, compte_id]
    );

    // Enregistrer la transaction
    const [result] = await conn.query(
      'INSERT INTO transactions (type, montant, devise, compte_id, description, statut) VALUES (?, ?, ?, ?, ?, ?)',
      ['retrait', montant, compte.devise, compte_id, description || 'Retrait', 'success']
    );

    // Lire le nouveau solde
    const [updated] = await conn.query('SELECT solde FROM comptes WHERE id = ?', [compte_id]);

    await conn.commit();

    res.status(200).json({
      statut: 'success',
      message: 'Retrait effectué avec succès.',
      transaction_id: result.insertId,
      nouveau_solde: parseFloat(updated[0].solde),
      devise: compte.devise,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ statut: 'error', message: 'Erreur serveur.', detail: err.message });
  } finally {
    conn.release();
  }
};
