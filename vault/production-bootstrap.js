// 🏛️ SOVEREIGN VAULT: ELITE BOOTSTRAP SEQUENCE
// This script configures Audit Logs, AppRole, Policies, and Secrets for Production

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const VAULT_ADDR = process.env.VAULT_ADDR || 'https://127.0.0.1:8200';
const ROOT_TOKEN = process.env.VAULT_TOKEN; // Requirement: Vault must be unsealed and token provided

const vault = axios.create({
    baseURL: `${VAULT_ADDR}/v1`,
    headers: { 'X-Vault-Token': ROOT_TOKEN },
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
});

async function bootstrap() {
    try {
        console.log("🚀 INITIATING SOVEREIGN VAULT BOOTSTRAP...");

        // 1. 🔍 ENABLE AUDIT LOGGING
        console.log("--- 🔍 Enabling Audit Logs...");
        try {
            await vault.post('/sys/audit/file-audit', {
                type: 'file',
                options: { file_path: '/vault/logs/audit.log' }
            });
            console.log("✅ Audit logging synchronized to /vault/logs/audit.log");
        } catch (e) {
            if (e.response?.status === 400) console.log("ℹ️ Audit logging already enabled.");
            else throw e;
        }

        // 2. 📜 CREATE POLICIES (Least Privilege)
        console.log("--- 📜 Defining Security Policies...");
        const backendPolicy = `
            path "secret/data/sovereign-estate" {
                capabilities = ["read"]
            }
            path "auth/token/lookup-self" {
                capabilities = ["read"]
            }
        `;
        await vault.put('/sys/policies/acl/sovereign-backend-policy', { policy: backendPolicy });
        console.log("✅ 'sovereign-backend-policy' registered.");

        // 3. 🔑 ENABLE APPROLE AUTH
        console.log("--- 🔑 Enabling AppRole Authentication...");
        try {
            await vault.post('/sys/auth/approle', { type: 'approle' });
        } catch (e) {
            if (e.response?.status === 400) console.log("ℹ️ AppRole already enabled.");
            else throw e;
        }

        // 4. 🎭 CONFIGURE APPROLE FOR BACKEND
        console.log("--- 🎭 Configuring Backend AppRole...");
        await vault.post('/auth/approle/role/sovereign-backend', {
            token_policies: ['sovereign-backend-policy'],
            token_ttl: '1h',
            token_max_ttl: '4h'
        });

        const roleIdRes = await vault.get('/auth/approle/role/sovereign-backend/role-id');
        const roleId = roleIdRes.data.data.role_id;

        const secretIdRes = await vault.post('/auth/approle/role/sovereign-backend/secret-id');
        const secretId = secretIdRes.data.data.secret_id;

        console.log("\n💎 SOVEREIGN CREDENTIALS GENERATED:");
        console.log(`🔹 ROLE_ID:   ${roleId}`);
        console.log(`🔹 SECRET_ID: ${secretId}`);
        console.log("⚠️  SAVE THESE IN YOUR CI/CD OR ENV SECRETS IMMEDIATELY.\n");

        // 5. 🔓 AUTO UNSEAL (Note: Requires cloud provider or another Vault instance)
        console.log("--- 🔓 Auto-Unseal: Transit Mechanism logic ready in vault.hcl.");
        console.log("ℹ️  Production recommendation: Use KMS (AWS/GCP/Azure) or Transit Engine.");

        console.log("✨ SOVEREIGN VAULT UPGRADE COMPLETE. SYSTEM SECURED.");

    } catch (error) {
        console.error("❌ BOOTSTRAP FAILED:", error.response?.data || error.message);
        process.exit(1);
    }
}

bootstrap();
