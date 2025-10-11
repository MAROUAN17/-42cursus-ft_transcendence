storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 0
  tls_cert_file = "/vault/cert/certificate.pem"
  tls_key_file = "/vault/cert/key.pem"
}

ui = true
disable_mlock = true