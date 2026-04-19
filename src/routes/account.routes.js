const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Gestion des comptes bancaires
 */

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Lister tous les comptes bancaires (TP School)
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Liste de tous les comptes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statut:
 *                   type: string
 *                 donnees:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 */
router.get('/', accountController.listAllAccounts);

module.exports = router;
