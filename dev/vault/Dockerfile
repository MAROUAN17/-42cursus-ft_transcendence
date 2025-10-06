FROM alpine:latest

RUN apk update && apk add wget bash unzip openssl && \
    wget https://releases.hashicorp.com/vault/1.20.3/vault_1.20.3_linux_amd64.zip && \
    unzip vault_1.20.3_linux_amd64.zip && \
    mv vault /usr/local/bin && \
    chmod +x /usr/local/bin/vault && \
    rm vault_1.20.3_linux_amd64.zip && mkdir -p /vault/data /vault/config

RUN mkdir -p /vault/cert/ /vault/shared/ && \
    openssl req -x509 -nodes -newkey rsa:4096 \
    -keyout /vault/cert/key.pem \
    -out /vault/shared/certificate.pem \
    -days 365 \
    -subj "/CN=vault"

COPY ./conf/vault.hcl /vault/config/vault.hcl
COPY ./tools/entry.sh /entry.sh
RUN chmod +x /entry.sh

ENTRYPOINT ./entry.sh