import vault from 'node-vault';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.error("❌ No .env file found in backend folder.");
    process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));

const vaultOptions = {
    apiVersion: 'v1',
    endpoint: envConfig.VAULT_ADDR || 'http://127.0.0.1:8200'
};

const client = vault(vaultOptions);

async function migrate() {
    try {
        console.log("🏦 Connecting to Vault...");

        // Try Root Token first for migration (elevated privileges)
        const keysPath = path.resolve(__dirname, '../../vault/vault-keys.json');
        if (fs.existsSync(keysPath)) {
            const keyData = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
            if (keyData.root_token) {
                console.log("🗝️ Using Root Token for administrative migration...");
                client.token = keyData.root_token;
            }
        }

        // Fallback to AppRole if Root Token didn't work/not found
        if (!client.token && envConfig.VAULT_ROLE_ID && envConfig.VAULT_SECRET_ID) {
            const login = await client.approleLogin({
                role_id: envConfig.VAULT_ROLE_ID,
                secret_id: envConfig.VAULT_SECRET_ID
            });
            client.token = login.auth.client_token;
        }

        const secretsToMigrate: any = {};
        const keysToExclude = ['VAULT_ADDR', 'VAULT_ROLE_ID', 'VAULT_SECRET_ID', 'NODE_TLS_REJECT_UNAUTHORIZED'];

        Object.keys(envConfig).forEach(key => {
            if (!keysToExclude.includes(key)) {
                let value = envConfig[key];
                // Transform localhost to sovereign_db for internal docker communication
                if (key === 'DATABASE_URL') {
                    value = value.replace('localhost', 'db').replace('127.0.0.1', 'db');
                }
                secretsToMigrate[key] = value;
            }
        });

        // Add a default JWT_SECRET if not present
        if (!secretsToMigrate.JWT_SECRET) {
            secretsToMigrate.JWT_SECRET = "sovereign_elite_jwt_secret_2026_@_!_#";
        }

        console.log(`📦 Preparing to migrate ${Object.keys(secretsToMigrate).length} secrets...`);

        await client.write('secret/data/sovereign-estate', {
            data: secretsToMigrate
        });

        console.log("✅ SUCCESS: Secrets moved to Vault path: secret/data/sovereign-estate");
        console.log("⚠️ You can now safely delete the .env file.");

    } catch (error: any) {
        console.error("❌ Migration Failed:", error.message);
    }
}

migrate();
