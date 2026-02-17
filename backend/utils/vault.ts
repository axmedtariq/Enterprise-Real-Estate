import vault from 'node-vault';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const getVaultOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const endpoint = process.env.VAULT_ADDR || (isProduction ? 'https://sovereign_vault:8200' : 'http://sovereign_vault:8200');

    // Load CA Cert if in production/TLS mode
    let requestOptions = {};
    if (process.env.VAULT_CACERT && fs.existsSync(process.env.VAULT_CACERT)) {
        requestOptions = {
            ca: fs.readFileSync(process.env.VAULT_CACERT)
        };
    }

    return {
        apiVersion: 'v1',
        endpoint,
        requestOptions
        // Token will be set after AppRole login
    };
};

const vaultClient = vault(getVaultOptions());

export const initializeVault = async () => {
    try {
        console.log("🏦 Connecting to Sovereign Vault...");

        // 1. AppRole Authentication (Preferred for Machine-to-Machine)
        if (process.env.VAULT_ROLE_ID && process.env.VAULT_SECRET_ID) {
            console.log("🔐 Authenticating via AppRole...");
            const result = await vaultClient.approleLogin({
                role_id: process.env.VAULT_ROLE_ID,
                secret_id: process.env.VAULT_SECRET_ID,
            });
            vaultClient.token = result.auth.client_token;
            console.log("✅ Encrypted Session Established.");
        } else if (process.env.VAULT_TOKEN) {
            vaultClient.token = process.env.VAULT_TOKEN;
            console.warn("⚠️ Using VAULT_TOKEN from environment (Not recommended for production).");
        } else {
            console.warn("⚠️ No credentials found. Assuming Vault is locally authenticated or dev mode.");
        }

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
