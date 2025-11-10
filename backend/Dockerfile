FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

# Use this for development (hot reloading)
CMD ["npm", "run", "dev"]

# For production, you would use:
# CMD ["node", "src/server.js"]