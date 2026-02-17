ui = true
disable_mlock = true

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 0
  tls_cert_file = "/vault/config/certs/vault.pem"
  tls_key_file  = "/vault/config/certs/vault-key.pem"
}

api_addr = "https://127.0.0.1:8200"
cluster_addr = "https://127.0.0.1:8201"
