# 🛡️ SOVEREIGN ENTERPRISE: APP POLICY (v1.0.0)
# This policy grants the least amount of privilege required for the backend engine to operate.

# 1. 🔑 READ CONFIGURATION SECRETS
# Grants access to sensitive environment variables (Supabase, Stripe, etc.)
path "sovereign/data/config/*" {
  capabilities = ["read", "list"]
}

# 2. 🛢️ READ DATABASE CREDENTIALS
# Grants access to Postgres/Prisma connection strings
path "sovereign/data/database/*" {
  capabilities = ["read", "list"]
}

# 3. 🎫 TOKEN LIFECYCLE MANAGEMENT
# Allows the application to renew its own token lease (SRE Best Practice)
path "auth/token/renew-self" {
  capabilities = ["update"]
}

path "auth/token/lookup-self" {
  capabilities = ["read"]
}

# 4. 🕵️ AUDIT & HEALTH (Status-only)
path "sys/health" {
  capabilities = ["read"]
}

# 5. 🚫 DENY SENSITIVE PATHS (Implicit, but made explicit for audit)
path "sys/auth/*" {
  capabilities = ["deny"]
}

path "sys/audit/*" {
  capabilities = ["deny"]
}

path "sys/mounts/*" {
  capabilities = ["deny"]
}

# 6. 🌍 METADATA ACCESS
path "sovereign/metadata/*" {
  capabilities = ["list"]
}
