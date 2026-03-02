
# 🏛️ SOVEREIGN VAULT: ENTERPRISE PRODUCTION CONFIGURATION
ui = true
disable_mlock = true

# RAID-Grade Storage Layer (Raft Clustering)
storage "raft" {
  path    = "/vault/data"
  node_id = "sovereign-vault-01"
}

# Elite Security Listener (TLS Enabled)
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/vault/certs/vault.pem"
  tls_key_file  = "/vault/certs/vault-key.pem"
  
  # Forwarded IP Support
  x_forwarded_for_authorized_addrs = "127.0.0.1,10.0.0.0/8"

  telemetry {
    unauthenticated_metrics_access = true
  }
}

# 🔍 AUDIT LOGGING (Military Grade Tracking)
# This will be enabled via CLI/API during bootstrap to specific file path
# path: /vault/logs/audit.log

# 🔓 AUTO UNSEAL (Transit Integration / Cloud KMS Placeholder)
# seal "transit" {
#   address            = "https://auto-unseal-vault:8200"
#   disable_renewal    = "false"
#   key_name           = "sovereign-unseal-key"
#   mount_path         = "transit/"
#   tls_skip_verify    = "true"
# }

# Infrastructure Addresses
api_addr     = "https://sovereign-vault:8200"
cluster_addr = "https://sovereign-vault:8201"

telemetry {
  disable_hostname = true
  prometheus_retention_time = "24h"
}
