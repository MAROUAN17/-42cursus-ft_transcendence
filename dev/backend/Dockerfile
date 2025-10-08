FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip python3-setuptools python3-wheel make g++ bash && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY ./files/package*.json /app/.

RUN npm install

COPY ./files /app

CMD ["npm", "run", "dev", "--", "--host"]