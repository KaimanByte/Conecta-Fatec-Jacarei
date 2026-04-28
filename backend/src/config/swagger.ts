import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chatbot Acadêmico API',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de autoatendimento da Fatec Jacareí',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local',
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
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
