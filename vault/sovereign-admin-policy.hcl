# 💎 SOVEREIGN ENTERPRISE: ADMIN POLICY (v1.0.0)
# This policy grants full CRUD access to the 'sovereign' path for human administrators.

# 1. 📂 FULL KV ACCESS
path "sovereign/*" {
  capabilities = ["create", "read", "update", "delete", "list", "patch"]
}

# 2. 📝 POLICY MANAGEMENT (Standard Admin)
path "sys/policies/acl/*" {
  capabilities = ["read", "list"]
}

# 3. 👤 AUTH METHOD VISIBILITY
path "sys/auth" {
  capabilities = ["read", "list"]
}

# 4. 🎫 TOKEN MGMT
path "auth/token/lookup-self" {
  capabilities = ["read"]
}
