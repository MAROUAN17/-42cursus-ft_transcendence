FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip py3-setuptools py3-wheel make g++ bash

WORKDIR /app

COPY ./files/package*.json /app/.

RUN npm install

COPY ./files /app

CMD ["npm", "run", "dev", "--", "--host"]
# CMD ["tail", "-f", "/dev/null"]