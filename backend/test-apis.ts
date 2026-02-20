import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

async function testAPIs() {
    try {
        console.log('--- TESTING API ENDPOINTS ---');

        // 1. Login as Admin
        console.log('\n🔐 1. Testing Login (Admin)...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@sovereign.com',
            password: 'admin123',
        });

        if (loginRes.status === 200) {
            console.log('✅ Login Successful');
            const token = loginRes.data.token;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // 2. Get Current User (Protected)
            console.log('\n👤 2. Testing Get Current User (Protected)...');
            const meRes = await axios.get(`${API_URL}/auth/me`, config);
            console.log(`✅ User: ${meRes.data.user.name} (${meRes.data.user.role})`);

            // 3. Get Properties (Public)
            console.log('\n🏗️ 3. Testing Get Properties (Public)...');
            const propsRes = await axios.get(`${API_URL}/properties?limit=5`);
            console.log(`✅ Retrieved ${propsRes.data.count} properties (showing first 5)`);

            // 4. Create Property (Admin Only)
            console.log('\n🏗️ 4. Testing Create Property (Admin Only)...');
            const newProp = {
                title: 'Super Admin HQ',
                price: 9999999,
                address: '1 Sovereign Way',
                lat: 40.7128,
                lng: -74.0060,
                description: 'The headquarters of the Super Admin.',
                category: 'buy',
                isVIP: true,
                companyId: 'SOVEREIGN_GLOBAL'
            };

            try {
                const createPropRes = await axios.post(`${API_URL}/admin/property/new`, newProp, config);
                console.log(`✅ Property Created: ${createPropRes.data.data.title} (ID: ${createPropRes.data.data.id})`);
            } catch (err: any) {
                console.error('❌ Create Property Failed:', err.response ? err.response.data : err.message);
            }

            // 5. Check Admin Route (from authRoutes)
            console.log('\n🛡️ 5. Testing Admin Route...');
            try {
                const adminRes = await axios.get(`${API_URL}/auth/admin`, config);
                console.log(`✅ Admin Access: ${adminRes.data.message}`);
            } catch (err: any) {
                console.error('❌ Admin Route Failed:', err.response ? err.response.data : err.message);
            }

        } else {
            console.error('❌ Login Failed');
        }

    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Connection Refused. Is the backend server running on port 5000?');
        } else {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Response Data:', error.response.data);
            }
        }
    }
}

testAPIs();
