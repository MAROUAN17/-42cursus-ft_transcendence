FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Expose Vite port
EXPOSE 3000

# Start dev server with hot reload
CMD ["npm", "run", "dev", "--", "--host"]