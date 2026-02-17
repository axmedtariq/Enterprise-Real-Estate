# 🏦 Sovereign Vault Instructions

For maximum security, the Sovereign Estate platform uses **HashiCorp Vault** to manage sensitive credentials (database passwords, API keys, etc.) instead of plain text `.env` files.

## 1. Start the System
Ensure the vault service is running:
```bash
docker-compose up -d vault
```
Access the Vault UI at: http://localhost:8200
- **Token**: `sovereign-root-token`

## 2. Initialize Secrets
You need to store your secrets in the Vault so the backend can retrieve them securely.

### Option A: Using the Vault UI
1. Login with the token above.
2. Navigate to `secret/` -> `Create Secret`.
3. Set path to: `sovereign-estate`
4. Add the following Key/Value pairs:
   - `DATABASE_URL`: `sqlserver://...`
   - `JWT_SECRET`: `...`
   - `CLOUDINARY_URL`: `...`
   - `SMTP_HOST`: `...`
   - `SMTP_USER`: `...`
   - `SMTP_PASSWORD`: `...`

### Option B: Using cURL (Command Line)
Run the following command to populate the vault with default dev secrets:

```bash
curl --header "X-Vault-Token: sovereign-root-token" \
     --request POST \
     --data "{\"data\": {\"JWT_SECRET\": \"SUPER_SECRET_VAULT_KEY_2026\", \"DATABASE_URL\": \"sqlserver://sovereign_db:1433;database=elite_estate;user=sa;password=Sovereign_Secret_123!;encrypt=true;trustServerCertificate=true;\"}}" \
     http://localhost:8200/v1/secret/data/sovereign-estate
```

## 3. Verify Integration
Restart the backend service. It will connect to the Vault, fetch these secrets, and inject them into the application environment.

```bash
docker-compose restart backend
```

## ⚠️ Security Note
In a production environment:
1. Do not use the `sovereign-root-token`.
2. Unseal the vault manually.
3. Configure strict access policies for the backend service.
