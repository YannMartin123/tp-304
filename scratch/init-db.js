const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function initializeDatabase() {
  console.log('🚀 Initialisation de la base de données Aiven...');

  try {
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Séparer les commandes SQL
    // Note: cette méthode simple peut échouer si des points-virgules sont dans des strings, 
    // mais pour notre script standard ça devrait aller.
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await db.query(statement);
    }

    console.log('✅ Base de données initialisée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de l’initialisation :', err.message);
  } finally {
    process.exit();
  }
}

initializeDatabase();
