const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL 
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

// Ajouter SSL pour Aiven (Production)
if (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
  if (typeof poolConfig === 'string') {
    // Si c'est une URL, on ne peut pas facilement injecter SSL via l'objet config
    // mais mysql2 supporte les query params dans l'URL. 
    // Cependant, pour plus de sécurité, on peut utiliser l'objet.
  } else {
    poolConfig.ssl = {
      rejectUnauthorized: false
    };
  }
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
