const mysql = require('mysql2/promise');
require('dotenv').config();

let poolConfig = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL 
  : {
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
    };

// Nettoyage de l'URL si nécessaire (pour éviter les warnings mysql2 sur ssl-mode)
if (typeof poolConfig === 'string' && poolConfig.includes('ssl-mode=')) {
  poolConfig = poolConfig.replace(/(\?|&)ssl-mode=[^&]+/, '');
}

// Ajouter SSL pour Aiven (Production)
if (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
  if (typeof poolConfig === 'object') {
    poolConfig.ssl = {
      rejectUnauthorized: false
    };
  } else {
    // Si c'est une string, on la convertit en objet pour pouvoir injecter SSL proprement
    // Ou on laisse mysql2 gérer si l'URL est correcte, mais ici on force l'objet pour la fiabilité
  }
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
