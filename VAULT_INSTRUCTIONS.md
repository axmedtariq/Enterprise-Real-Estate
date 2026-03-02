# 🏛️ Sovereign Vault: Enterprise Production Guide

The Sovereign Estate platform has been upgraded to **production-grade security**. Vault now runs in **Server Mode** with **HTTPS (TLS)** enabled, **Raft storage** clustering, and **AppRole** machine-to-machine authentication.

## 1. ⚙️ Production Mode Overview
- **Storage**: Raft (Consensus clustering for high availability).
- **Network**: Listener on HTTPS (TLS required).
- **Unseal**: Manual (Standard) or Auto-Unseal (Transit/Cloud KMS).
- **Logging**: Military-grade audit logging to `/vault/logs/audit.log`.

## 2. 🏁 Initializing the Cluster
When running in production mode for the first time, you must initialize and unseal:

```bash
# 1. Start the vault server
docker-compose up -d vault

# 2. Initialize (Run only once manually)
docker exec -it sovereign_vault vault operator init
```
**⚠️ Save the unseal keys and root token securely!**

## 3. 🔓 Unsealing (Manual)
Vault starts in a **Sealed** state. You must provide 3 of 5 unseal keys before any service can connect:

```bash
docker exec -it sovereign_vault vault operator unseal <key1>
docker exec -it sovereign_vault vault operator unseal <key2>
docker exec -it sovereign_vault vault operator unseal <key3>
```

## 4. 🚀 Bootstrapping Production Security (Audit, AppRole, Policies)
Once unsealed, run the **Sovereign Bootstrap** script to enable audit logs and generate AppRole credentials for the backend:

```bash
# Provide the root token from the 'init' step
export VAULT_TOKEN="your-root-token"
export VAULT_ADDR="https://localhost:8200"
node vault/production-bootstrap.js
```

## 5. 🔑 AppRole Machine Authentication
The backend no longer uses a root token. It uses an **AppRole** (`ROLE_ID` and `SECRET_ID`):

1. Run the bootstrap script above.
2. Note the generated `ROLE_ID` and `SECRET_ID`.
3. Update `docker-compose.yml` or your CI/CD secrets:
   - `VAULT_ROLE_ID`: "your-role-id"
   - `VAULT_SECRET_ID`: "your-secret-id"

## 🔍 Audit & Compliance
All secret access and management actions are logged to the audit file for forensic tracking:
`docker exec -it sovereign_vault tail -f /vault/logs/audit.log`

---
**The Sovereign Network is now protected by military-grade vault orchestration.**
