const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// Toutes ces routes nécessitent un JWT valide
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Opérations bancaires (Dépôts, Retraits)
 */

/**
 * @swagger
 * /api/transactions/depot:
 *   post:
 *     summary: Effectuer un dépôt sur un compte
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - compte_id
 *               - montant
 *             properties:
 *               compte_id:
 *                 type: integer
 *               montant:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dépôt réussi
 *       404:
 *         description: Compte introuvable
 */
router.post('/depot', transactionController.depot);

/**
 * @swagger
 * /api/transactions/retrait:
 *   post:
 *     summary: Effectuer un retrait depuis un compte
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - compte_id
 *               - montant
 *             properties:
 *               compte_id:
 *                 type: integer
 *               montant:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Retrait réussi
 *       400:
 *         description: Solde insuffisant
 *       404:
 *         description: Compte introuvable
 */
router.post('/retrait', transactionController.retrait);

module.exports = router;
