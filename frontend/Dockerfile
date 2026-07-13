# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Enforce node-server preset during build
ENV NITRO_PRESET=node-server
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000
ENV PORT=3000
ENV NITRO_PORT=3000
CMD ["node", ".output/server/index.mjs"]
