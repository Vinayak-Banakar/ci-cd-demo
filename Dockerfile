# Stage 1: build stage
FROM node:20-alpine AS tester
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test

# Stage 2: production image
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=tester /app .
USER node
EXPOSE 3000
CMD ["node", "app.js"]
