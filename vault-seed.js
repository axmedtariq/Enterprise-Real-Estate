process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
const fs = require('fs');
const path = require('path');

const VAULT_ADDR = 'https://127.0.0.1:8200';
const KEYS_FILE = path.join(__dirname, 'vault', 'vault-keys.json');

const agent = new https.Agent({ rejectUnauthorized: false });

function request(method, endpoint, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: '127.0.0.1',
            port: 8200,
            path: endpoint,
            method: method,
            agent: agent,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (token) opts.headers['X-Vault-Token'] = token;

        if (data) {
            data = JSON.stringify(data);
            opts.headers['Content-Length'] = data.length;
        }

        const req = https.request(opts, (res) => {
            let chunks = '';
            res.on('data', d => chunks += d);
            res.on('end', () => resolve({ status: res.statusCode, body: chunks }));
        });

        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function run() {
    try {
        const keyData = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
        const keys = keyData.keys;
        const rootToken = keyData.root_token;

        console.log("Unsealing...");
        for (let i = 0; i < 3; i++) {
            const res = await request('PUT', '/v1/sys/unseal', { key: keys[i] });
            console.log(`Unseal step ${i + 1} status:`, res.status);
        }

        console.log("Writing secrets...");
        const secretData = {
            data: {
                JWT_SECRET: "SUPER_SECRET_VAULT_KEY_2026",
                DATABASE_URL: "sqlserver://sovereign_db:1433;database=RealEstate;user=Tariq;password=abc123;encrypt=false;trustServerCertificate=true",
                CLOUDINARY_URL: "cloudinary://test:test@test"
            }
        };

        const res = await request('POST', '/v1/secret/data/sovereign-estate', secretData, rootToken);
        console.log(`Secrets write status:`, res.status, res.body);

        console.log("Done!");
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
