const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 5003;

app.use(helmet());
app.use(express.json());

// 🏗️ SOVEREIGN BOOKING ENGINE (Microservice Interface)
app.get('/api/v1/bookings/health', (req, res) => {
    res.status(200).json({ status: 'BOOKING_SVC_UP', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'SOVEREIGN_BOOKING_ENGINE_ONLINE' });
});

app.listen(PORT, () => {
    console.log(`💳 Sovereign Booking Engine online on port ${PORT}`);
});
