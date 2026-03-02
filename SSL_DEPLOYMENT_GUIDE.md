# 🔐 Sovereign SSL: Let's Encrypt Deployment Guide

The Sovereign Estate platform now supports automated SSL via **Certbot** and **NGINX**. This guide explains how to secure your production domain.

## 1. 📂 Prerequisites
- A registered domain name (e.g., `sovereign.estate`).
- Ports **80** and **443** must be open on your firewall/router.
- Your domain's A-Record must point to your server's IP.

## 2. 🏁 Initial Certificate Request
When running for the first time, you must request a certificate before NGINX can successfully start with SSL enabled.

```bash
# 1. Start NGINX in "Bootstrap" mode (Port 80 only)
# Note: You may need to temporarily comment out SSL lines in nginx.conf if NGINX fails to start without certs.

# 2. Run Certbot to get the certificate
docker run --rm -it \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d yourdomain.com \
  --email admin@yourdomain.com \
  --agree-tos --no-eff-email
```

## 3. 🔄 Automatic Renewals
The `sovereign_certbot` container is configured as a **Sidecar**.
- It runs a check every **12 hours**.
- If a certificate is within 30 days of expiry, it will automatically renew it.
- **Note**: After renewal, you must reload NGINX:
  `docker exec sovereign_nginx nginx -s reload`

## 🛡️ SSL Configuration Hardening
Our `nginx.conf` is pre-configured with military-grade settings:
- **TLS 1.2 & 1.3 only** (Deprecated versions disabled).
- **HSTS Enabled** (Strict-Transport-Security for 1 year).
- **OCSP Stapling** (Faster SSL handshakes).
- **Perfect Forward Secrecy** (Using ECDHE ciphers).

## 🛠️ Testing Locally (Self-Signed)
For local testing (localhost), Let's Encrypt will not issue a certificate. To test the SSL logic locally:
1. Generate self-signed certs into `./certbot/conf/live/localhost/`.
2. Map the filenames to `fullchain.pem` and `privkey.pem`.

---
**Your Sovereign perimeter is now encrypted and verified.**
