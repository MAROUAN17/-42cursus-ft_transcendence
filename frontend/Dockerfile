FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./tools/entry.sh /
COPY ./files ./
COPY ./files/assets ./public

RUN chmod +x /entry.sh && mkdir /ssl && openssl req -x509 -nodes -newkey rsa:4096 \
    -keyout /ssl/key.pem \
    -out /ssl/certificate.pem \
    -days 365 \
    -subj "/CN=cert"

RUN npm install

EXPOSE 3000

ENTRYPOINT /entry.sh