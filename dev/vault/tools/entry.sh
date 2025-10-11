#!/bin/bash
set -x
# set -e

rm -f /vault/shared/token.txt

export VAULT_SKIP_VERIFY=true

vault server -config=/vault/config/vault.hcl &

until nc -z 127.0.0.1 8200; do
  echo "Waiting for Vault Server..."
  sleep 1
done

if vault status 2>/dev/null | grep 'Initialized.*false'; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 > /vault/init_keys.txt
else
  echo "Vault already initialized"
fi

export TOKEN=$(grep "Root Token" /vault/init_keys.txt | head -1 | awk '{print $4}')
export KEYS=$(grep "Unseal Key" /vault/init_keys.txt | head -3 | awk '{print $4}')

for key in $KEYS; do
    vault operator unseal $key
done

echo $TOKEN | vault login -

vault secrets enable -path=secret kv

echo 'path "secret/*" {
  capabilities = ["read"]
}' > policy.hcl

vault policy write readonly policy.hcl

vault kv put secret/jwt JWT_TMP_LOGIN="$JWT_TMP_LOGIN" JWT_ACCESS_TOKEN="$JWT_ACCESS_TOKEN" JWT_REFRESH_TOKEN="$JWT_REFRESH_TOKEN"
vault kv put secret/nodemailer GMAIL_USERNAME="$GMAIL_USERNAME" GMAIL_PASS="$GMAIL_PASS"
vault kv put secret/oauth CLIENT_UUID="$CLIENT_UUID" CLIENT_SECRET="$CLIENT_SECRET"
cp /vault/cert/certificate.pem /vault/shared/
vault token create -policy readonly -ttl=24h | grep "token" | head -1 | awk '{print $2}' > /vault/shared/token.txt

tail -f /dev/null;