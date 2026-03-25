import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sovereign Real Estate Enterprise API',
            version: '1.0.0',
            description: 'Professional Military-Grade Enterprise API for Real Estate Management. Features integrated Vault security, Istio monitoring, and Redis caching.',
            contact: {
                name: 'Enterprise Support',
                url: 'http://localhost:3000'
            },
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development Server (External Ports)'
            },
            {
                url: 'http://backend:5000',
                description: 'Internal Docker Network'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.ts', './server.ts', './app.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
