import vault from 'node-vault';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    apiVersion: 'v1', // default
    endpoint: process.env.VAULT_ADDR || 'http://sovereign_vault:8200', // Docker network address
    token: process.env.VAULT_TOKEN || 'sovereign-root-token', // Dev token
};

const vaultClient = vault(options);

export const initializeVault = async () => {
    try {
        console.log("🏦 Connecting to Sovereign Vault...");

        // Check if Vault is sealed
        const status = await vaultClient.status();
        if (status.sealed) {
            console.error("❌ VAULT IS SEALED. Please unseal manually via the CLI.");
            // In production, you would handle unsealing securely here or via operator intervention
            // process.exit(1); 
            return;
        }

        // Try to read secrets from a specific path
        // Path: secret/data/sovereign-estate
        try {
            const secretPath = 'secret/data/sovereign-estate';
            const result = await vaultClient.read(secretPath);

            if (result && result.data && result.data.data) {
                const secrets = result.data.data;
                console.log("✅ Secrets retrieved successfully from Vault.");

                // Inject secrets into process.env
                Object.keys(secrets).forEach(key => {
                    process.env[key] = secrets[key];
                });
            } else {
                console.warn("⚠️ No secrets found at 'secret/data/sovereign-estate'. Using local .env fallback.");
            }
        } catch (err: any) {
            if (err.response && err.response.statusCode === 404) {
                console.warn("⚠️ Secret path not found. Please initialize secrets in Vault.");
            } else {
                console.error("❌ vault read error", err);
            }
        }

    } catch (error) {
        console.error("❌ Failed to connect to Vault:", error);
        console.warn("⚠️ Falling back to local .env configuration.");
    }
};

export default vaultClient;
