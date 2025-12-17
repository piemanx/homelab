# Stage 1: Build React Client
FROM node:18-alpine as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Node Server
FROM node:18-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Copy built client assets from Stage 1
COPY --from=client-build /app/client/dist ../client/dist

# Expose internal port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
