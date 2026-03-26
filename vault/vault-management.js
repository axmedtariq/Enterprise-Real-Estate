/**
 * 🛡️ SOVEREIGN VAULT SECRETS OVERLORD: ENTERPRISE EDITION
 * Elite provisioning script for Production Secrets Management using HCL Policies.
 */
const fs = require('fs');
const path = require('path');
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200',
  token: process.env.VAULT_TOKEN || 'sovereign-root-token'
});

async function provisionSovereignVault() {
  try {
    console.log("🛡️ Initializing Enterprise Vault Overlord...");

    // 1. 📂 MOUNT KV ENGINE (V2)
    try {
      await vault.mount({
        mount_point: 'sovereign',
        type: 'kv',
        options: { version: '2' }
      });
      console.log("✅ Mounted 'sovereign' KV Engine.");
    } catch (e) { 
      if (e.message.includes('already exists')) {
        console.log("ℹ️ Engine 'sovereign' already exists."); 
      } else {
        console.error("❌ Mounting Error:", e.message);
        throw e;
      }
    }

    // 2. 📝 LOAD & APPLY HCL POLICIES
    const appPolicyHcl = fs.readFileSync(path.join(__dirname, 'sovereign-app-policy.hcl'), 'utf8');
    const adminPolicyHcl = fs.readFileSync(path.join(__dirname, 'sovereign-admin-policy.hcl'), 'utf8');
    
    await vault.addPolicy({ name: 'sovereign-app-policy', rules: appPolicyHcl });
    await vault.addPolicy({ name: 'sovereign-admin-policy', rules: adminPolicyHcl });
    console.log("✅ HCL Policies (App & Admin) Synchronized.");

    // 3. 👤 CONFIGURE AUTH METHODS
    // 3a. AppRole (Machine-to-Machine)
    try {
      await vault.enableAuth({ mount_point: 'approle', type: 'approle' });
      console.log("✅ Enabled AppRole Auth.");
    } catch (e) {}

    // 3b. UserPass (Human Admin)
    try {
      await vault.enableAuth({ mount_point: 'userpass', type: 'userpass' });
      console.log("✅ Enabled UserPass Auth Method.");
    } catch (e) {}

    // Create Human Admin: Tariq
    await vault.write('auth/userpass/users/Tariq', {
      password: 'Somalilander123@123',
      policies: 'sovereign-admin-policy'
    });
    console.log("✅ Human Operator 'Tariq' Provisioned (Policy: sovereign-admin-policy).");

    // Create AppRole Linked to Policy
    await vault.write('auth/approle/role/sovereign-auth-engine', {
      token_policies: 'sovereign-app-policy',
      token_ttl: '24h',
      token_max_ttl: '72h',
      bind_secret_id: true // Require SecretID for login (Military Grade)
    });
    console.log("✅ AppRole 'sovereign-auth-engine' Configured.");

    // Retrieve RoleID for the app
    const roleId = await vault.read('auth/approle/role/sovereign-auth-engine/role-id');
    console.log(`🔗 APP_ROLE_ID: ${roleId.data.role_id}`);

    // 4. 💎 SEED INITIAL SECRETS
    await vault.write('sovereign/data/config/supabase', {
      data: {
        URL: "https://basdbtwzdunazynpzett.supabase.co",
        ANON_KEY: "PROD_SECRET_REDACTED",
        JWT_SECRET: "SOVEREIGN_V1_MASTER_KEY"
      }
    });

    await vault.write('sovereign/data/database/postgres', {
      data: {
        DATABASE_URL: "postgresql://postgres:REDACTED@host:5432/dbname",
        DIRECT_URL: "postgresql://postgres:REDACTED@host:5432/dbname"
      }
    });

    console.log("🔒 VAULT OVERLORD SYSTEM CONFIGURED SUCCESSFULLY (ENTERPRISE GRADE).");
  } catch (error) {
    console.error("❌ VAULT ERROR:", error.message);
  }
}

provisionSovereignVault();
