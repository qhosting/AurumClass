FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build frontend
RUN npm run build

# --- Production Stage ---
FROM node:20-slim

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev && npm install -g tsx

# Copy built assets and server code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/package.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV TZ=America/Mexico_City

EXPOSE 3000

# Start the server using tsx to run the TypeScript server file
CMD ["tsx", "server.ts"]
