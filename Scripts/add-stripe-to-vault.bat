@echo off
setlocal

REM ==========================================================
REM 🚀 ADD STRIPE SECRET TO SOVEREIGN VAULT
REM ==========================================================

echo 1. Checking for Vault Root Token...
set VAULT_ADDR=https://127.0.0.1:8200
set VAULT_SKIP_VERIFY=true

REM Assuming root token from the initialized vault
set ROOT_TOKEN=%VAULT_ROOT_TOKEN%

if "%ROOT_TOKEN%"=="" (
    echo ❌ ERROR: VAULT_ROOT_TOKEN environment variable is not set.
    pause
    exit /b 1
)

echo 2. Updating secret/data/sovereign-estate...
REM We use the vault CLI or curl here. Vault CLI is safer.
set VAULT_TOKEN=%ROOT_TOKEN%

vault kv patch -tls-skip-verify secret/sovereign-estate STRIPE_SECRET_KEY=%STRIPE_SECRET_KEY%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Successfully patched STRIPE_SECRET_KEY into Vault!
) else (
    echo.
    echo ❌ Failed to patch Vault. Ensure Vault server is running on %VAULT_ADDR% and you are unsealed.
)

pause
