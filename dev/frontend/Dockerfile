FROM node:20-slim

WORKDIR /app

COPY ./files/package*.json ./
COPY ./files/assets ./public

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]