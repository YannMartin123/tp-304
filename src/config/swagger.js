const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TP304-API',
      version: '1.0.0',
      description: 'API de gestion bancaire (Dépôts, Retraits, Authentification)',
      contact: {
        name: 'Support API',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Chemins vers les fichiers contenant les annotations Swagger
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📖 Swagger docs available at http://localhost:3000/api-docs');
}

module.exports = setupSwagger;
