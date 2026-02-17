@echo off
setlocal

REM ==========================================================
REM 🚀 SOVEREIGN VAULT PRODUCTION INITIALIZATION
REM ==========================================================
REM This script guides you through initializing a production-grade
REM HashiCorp Vault instance with AppRole authentication and
REM strict policies.
REM ==========================================================

REM Set Vault Address (Assuming certs are valid/trusted or skipping verify for init)
set VAULT_ADDR=https://127.0.0.1:8200
set VAULT_SKIP_VERIFY=true

echo 1. Initializing Vault...
echo ⚠️  IMPORTANT: SAVE THE UNSEAL KEYS AND ROOT TOKEN BELOW!
echo --------------------------------------------------------
curl --insecure --request PUT --data "{\"secret_shares\": 5, \"secret_threshold\": 3}" %VAULT_ADDR%/v1/sys/init
echo.
echo --------------------------------------------------------
echo.

echo 2. Unseal Process
echo Please run the following command 3 times with 3 different keys from above:
echo curl --insecure --request PUT --data "{\"key\": \"<UNSEAL_KEY>\"}" %VAULT_ADDR%/v1/sys/unseal
echo.

echo 3. Login with Root Token
echo Once unsealed, login using:
echo set VAULT_TOKEN=<ROOT_TOKEN>
echo.

echo 4. Enable AppRole Auth Method
echo curl --insecure --header "X-Vault-Token: <ROOT_TOKEN>" --request POST --data "{\"type\": \"approle\"}" %VAULT_ADDR%/v1/sys/auth/approle
echo.

echo 5. Create Backend Policy (backend-policy.hcl)
echo path "secret/data/sovereign-estate" { capabilities = ["read"] } > backend-policy.hcl
echo Upload policy:
echo curl --insecure --header "X-Vault-Token: <ROOT_TOKEN>" --request PUT --data "{\"policy\": \"$(cat backend-policy.hcl)\"}" %VAULT_ADDR%/v1/sys/policy/backend-policy
echo.

echo 6. Create AppRole for Backend checks
echo curl --insecure --header "X-Vault-Token: <ROOT_TOKEN>" --request POST --data "{\"policies\": \"backend-policy\"}" %VAULT_ADDR%/v1/auth/approle/role/sovereign-backend
echo.

echo 7. Get RoleID and SecretID
echo Get RoleID:
echo curl --insecure --header "X-Vault-Token: <ROOT_TOKEN>" %VAULT_ADDR%/v1/auth/approle/role/sovereign-backend/role-id
echo.
echo Generate SecretID:
echo curl --insecure --header "X-Vault-Token: <ROOT_TOKEN>" --request POST %VAULT_ADDR%/v1/auth/approle/role/sovereign-backend/secret-id
echo.

echo 8. Final Step
echo Add the RoleID and SecretID to your backend environment variables (VAULT_ROLE_ID, VAULT_SECRET_ID) or inject them via CI/CD.

pause
