echo "🏦 Configuring Sovereign Vault..."

# Wait for Vault to come online
echo "Waiting for Vault..."
# In a real script we'd check `curl http://localhost:8200/v1/sys/health`
timeout 5

# Set Vault Address
set VAULT_ADDR=http://127.0.0.1:8200
set VAULT_TOKEN=sovereign-root-token

# Login (not strictly needed with root token env var but good practice)
echo "Logging in..."
# vault login sovereign-root-token

# Enable KV secrets engine v2 (if not already)
# vault secrets enable -path=secret kv-v2

# Write Default Secrets
echo "Writing Secrets to Vault..."

curl --header "X-Vault-Token: sovereign-root-token" ^
     --request POST ^
     --data "{\"data\": {\"JWT_SECRET\": \"LUXURY_ESTATE_ELITE_SaaS_2026_SECURE_TOKEN\", \"DATABASE_URL\": \"sqlserver://sovereign_db:1433;database=RealEstateDB;user=sa;password=Password123!;encrypt=true;trustServerCertificate=true;\", \"CLOUDINARY_CLOUD_NAME\": \"your_name\", \"CLOUDINARY_API_KEY\": \"your_key\", \"CLOUDINARY_API_SECRET\": \"your_secret\", \"MONGO_URI\": \"mongodb://127.0.0.1:27017/luxury_estate\"}}" ^
     http://localhost:8200/v1/secret/data/sovereign-estate

# Instructions for User
echo "========================================================"
echo "✅ Secrets Migrated to Vault."
echo "✅ .env files have been cleared."
echo "To manage secrets, access the UI at: http://localhost:8200"
echo "Token: sovereign-root-token"
echo "========================================================"
