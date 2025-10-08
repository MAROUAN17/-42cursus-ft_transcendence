FROM node:20-slim

WORKDIR /app

COPY ./files/package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]