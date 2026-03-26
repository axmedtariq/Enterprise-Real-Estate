import vault from 'node-vault';

/**
 * 🛡️ SOVEREIGN SECRETS LOADER
 * Fetches critical enterprise credentials from HashiCorp Vault.
 */
export const loadSecrets = async () => {
    if (process.env.NODE_ENV === 'test') return;

    const vaultAddr = process.env.VAULT_ADDR || 'http://127.0.0.1:8200';
    const vaultToken = process.env.VAULT_TOKEN;

    if (!vaultToken) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('❌ CRITICAL: VAULT_TOKEN is missing in production environment!');
        }
        console.warn('⚠️ VAULT_TOKEN missing. Skipping Vault secret loading for local dev.');
        return;
    }

    const client = vault({
        apiVersion: 'v1',
        endpoint: vaultAddr,
        token: vaultToken
    });

    try {
        console.log('🛡️ Fetching secrets from Sovereign Vault...');
        
        // Fetch Database Secrets
        const dbSecrets = await client.read('sovereign/data/database/postgres');
        const { DATABASE_URL, DIRECT_URL } = dbSecrets.data.data;
        if (DATABASE_URL) process.env.DATABASE_URL = DATABASE_URL;
        if (DIRECT_URL) process.env.DIRECT_URL = DIRECT_URL;

        // Fetch Config Secrets (Supabase, Stripe, etc.)
        const configSecrets = await client.read('sovereign/data/config/supabase');
        const { URL, ANON_KEY, JWT_SECRET } = configSecrets.data.data;
        if (URL) process.env.VITE_SUPABASE_URL = URL;
        if (ANON_KEY) process.env.VITE_SUPABASE_ANON_KEY = ANON_KEY;
        if (JWT_SECRET) process.env.JWT_SECRET = JWT_SECRET;

        console.log('✅ Secrets imported from Vault successfully.');
    } catch (error: any) {
        console.error('❌ Vault Error:', error.message);
        if (process.env.NODE_ENV === 'production') {
            throw new Error('❌ CRITICAL: Failed to load secrets from Vault. Aborting start sequence.');
        }
    }
};
