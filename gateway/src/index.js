const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ ELITE GATEWAY SECURITY
app.use(helmet());
app.use(cors({ origin: '*' })); // Should be restricted in production

// 🚦 MICROSERVICES MAPPING
const services = {
    auth: 'http://auth-service:5001',
    property: 'http://property-service:5002',
    booking: 'http://booking-service:5003'
};

// 🛰️ DISPATCHER / PROXY LOGIC
app.use('/api/v1/auth', createProxyMiddleware({ 
    target: services.auth, 
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '/api/v1/auth' } 
}));

app.use('/api/v1/properties', createProxyMiddleware({ 
    target: services.property, 
    changeOrigin: true 
}));

app.use('/api/v1/bookings', createProxyMiddleware({ 
    target: services.booking, 
    changeOrigin: true 
}));

// 🏥 GATEWAY HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'GATEWAY_UP', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🛰️ Sovereign API Gateway online on port ${PORT}`);
});
