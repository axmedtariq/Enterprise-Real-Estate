@echo off
REM Generate local TLS Certificates for Vault and Backend using docker/alpine/openssl
REM This runs inside a temporary container to guarantee openssl availability

echo Generating Certificates...

REM Create self-signed CA
docker run --rm -v "%cd%/certs:/certs" -w /certs alpine/openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout ca-key.pem -out ca.pem -subj "/CN=Sovereign-Root-CA"

REM Generate Vault Key/CSR
docker run --rm -v "%cd%/certs:/certs" -w /certs alpine/openssl req -newkey rsa:4096 -nodes -keyout vault-key.pem -out vault.csr -subj "/CN=sovereign_vault" -addext "subjectAltName = DNS:sovereign_vault,DNS:localhost,IP:127.0.0.1"

REM Sign Vault CSR
docker run --rm -v "%cd%/certs:/certs" -w /certs alpine/openssl x509 -req -in vault.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out vault.pem -days 365 -extfile /etc/ssl/openssl.cnf -extensions v3_req

REM Generate Backend Key/CSR
docker run --rm -v "%cd%/certs:/certs" -w /certs alpine/openssl req -newkey rsa:4096 -nodes -keyout backend-key.pem -out backend.csr -subj "/CN=sovereign_api" -addext "subjectAltName = DNS:sovereign_api,DNS:localhost,IP:127.0.0.1"

REM Sign Backend CSR
docker run --rm -v "%cd%/certs:/certs" -w /certs alpine/openssl x509 -req -in backend.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out backend.pem -days 365

REM Clean up CSRs
docker run --rm -v "%cd%/certs:/certs" -w /certs sh -c "rm *.csr *.srl"

REM Ensure permissions (chmod equivalent in container, but host mapping matters)
REM On Windows host, permissions are usually fine for docker mount but we might need chown in container if using non-root user
REM For now we assume root user in container or loose permissions.

echo Certificates Generated successfully in ./certs
