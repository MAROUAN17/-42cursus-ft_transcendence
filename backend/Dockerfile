FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip python3-setuptools python3-wheel make g++ bash openssl && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY ./files/package*.json /app/.

RUN mkdir /ssl && \
    openssl req -x509 -nodes -newkey rsa:4096 \
    -keyout /ssl/key.pem \
    -out /ssl/certificate.pem \
    -days 365 \
    -subj "/CN=cert"

RUN npm install

# COPY ./files /app

CMD ["npm", "run", "dev", "--", "--host"]