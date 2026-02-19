const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');

// Vault Config
const VAULT_ADDR = 'https://127.0.0.1:8200';
const CURRENT_DIR = __dirname;
// Assume script is in Scripts/ folder, so vault is in ../vault
const VAULT_DIR = path.resolve(CURRENT_DIR, '../vault');
const KEYS_FILE = path.join(VAULT_DIR, 'vault-keys.json');

// Ensure VAULT_DIR exists
if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
}

// HTTP Request Helper
const agent = new https.Agent({ rejectUnauthorized: false });

async function request(method, endpoint, data = null, token = null) {
    const url = `${VAULT_ADDR}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        agent
    };

    if (token) {
        options.headers['X-Vault-Token'] = token;
    }

    try {
        const response = await fetch(url, {
            ...options,
            body: data ? JSON.stringify(data) : undefined
        });

        const text = await response.text();

        if (!response.ok) {
            // Handle expected errors (e.g. "path is already in use") by throwing, caller catches
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        // Handle empty responses (204 No Content)
        if (!text || text.trim() === '') {
            return {};
        }

        return JSON.parse(text);
    } catch (e) {
        throw e;
    }
}

async function main() {
    console.log('🚀 Checking Vault Status...');

    let keys = [];
    let rootToken = '';
    let isInitialized = false;

    // 1. Check Health (and if initialized)
    try {
        const health = await request('GET', '/v1/sys/health?standbyok=true');
        isInitialized = health.initialized;

        if (isInitialized) {
            console.log('ℹ️  Vault is already initialized.');

            // Try to load keys
            if (fs.existsSync(KEYS_FILE)) {
                console.log(`📂 Loading keys from ${KEYS_FILE}...`);
                const keyData = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
                if (keyData.keys && keyData.root_token) {
                    keys = keyData.keys;
                    rootToken = keyData.root_token;
                } else {
                    console.error('❌ Keys file found but missing keys or root_token.');
                    process.exit(1);
                }
            } else {
                console.error('❌ Vault is initialized but no keys file found at ' + KEYS_FILE);
                console.error('   Cannot proceed without unseal keys and root token.');
                process.exit(1);
            }

            if (health.sealed) {
                console.log('🔒 Vault is sealed. Unsealing...');
                if (keys.length < 3) {
                    console.error('❌ Not enough keys to unseal (need 3).');
                    process.exit(1);
                }
                for (let i = 0; i < 3; i++) {
                    await request('PUT', '/v1/sys/unseal', { key: keys[i] });
                    console.log(`   - Unseal key ${i + 1}/3 applied.`);
                }
                console.log('🔓 Vault unsealed.');
            } else {
                console.log('✅ Vault is already unsealed.');
            }
        } else {
            // Initialize
            console.log('🔑 Initializing Vault (5 shares, 3 threshold)...');
            const initData = await request('PUT', '/v1/sys/init', {
                secret_shares: 5,
                secret_threshold: 3
            });

            keys = initData.keys;
            rootToken = initData.root_token;

            console.log(`💾 Saving keys to ${KEYS_FILE}...`);
            fs.writeFileSync(KEYS_FILE, JSON.stringify(initData, null, 2));

            // Unseal
            console.log('🔓 Unsealing Vault...');
            for (let i = 0; i < 3; i++) {
                await request('PUT', '/v1/sys/unseal', { key: keys[i] });
                console.log(`   - Unseal key ${i + 1}/3 applied.`);
            }
        }

    } catch (e) {
        if (e.message.includes('ECONNREFUSED')) {
            console.error('❌ Could not connect to Vault. Is it running?');
            process.exit(1);
        }
        throw e;
    }

    // --- Configuration Phase ---
    console.log('\n⚙️  Configuring Vault AppRole...');

    // 4. Enable AppRole
    try {
        // Check if enabled first? List auth methods
        const authMethods = await request('GET', '/v1/sys/auth', null, rootToken);
        if (authMethods['approle/']) {
            console.log('✅ AppRole auth method already enabled.');
        } else {
            console.log('🛠 Enabling AppRole auth method...');
            await request('POST', '/v1/sys/auth/approle', { type: 'approle' }, rootToken);
        }
    } catch (e) {
        if (!e.message.includes('path is already in use')) console.warn('Warning checking/enabling AppRole:', e.message);
    }

    // 5. Create Policy
    console.log('📜 Creating/Updating backend-policy...');
    const policy = 'path "secret/data/sovereign-estate" { capabilities = ["read"] }';
    await request('PUT', '/v1/sys/policy/backend-policy', { policy }, rootToken);

    // 6. Create Role
    console.log('👤 Creating/Updating sovereign-backend role...');
    // We update policies
    await request('POST', '/v1/auth/approle/role/sovereign-backend', {
        policies: "backend-policy"
    }, rootToken);


    // 7. Get RoleID / SecretID
    console.log('🆔 Fetching Credentials...');
    const roleIdResp = await request('GET', '/v1/auth/approle/role/sovereign-backend/role-id', null, rootToken);

    // For SecretID, we create a new one each time usually.
    // Or check if we have one? SecretIDs expire. 
    // Let's create a new one.
    const secretIdResp = await request('POST', '/v1/auth/approle/role/sovereign-backend/secret-id', null, rootToken);

    const credentials = {
        role_id: roleIdResp.data.role_id,
        secret_id: secretIdResp.data.secret_id
    };

    console.log('\n✅ Vault Configured Successfully!');
    console.log('===================================================');
    console.log(`Role ID:     ${credentials.role_id}`);
    console.log(`Secret ID:   ${credentials.secret_id}`);
    console.log('===================================================');
    console.log(`Keys stored in: ${KEYS_FILE}`);

    // Update keys file with current credentials (approle)
    // Read existing
    let currentData = {};
    if (fs.existsSync(KEYS_FILE)) {
        currentData = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
    }
    const combined = {
        ...currentData,
        role_id: credentials.role_id,
        secret_id: credentials.secret_id,
        updated_at: new Date().toISOString()
    };
    fs.writeFileSync(KEYS_FILE, JSON.stringify(combined, null, 2));
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
