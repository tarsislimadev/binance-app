FROM node:20-alpine as builder

WORKDIR /build
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm ci
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /build/dist ./dist/

EXPOSE 5173

ENV NODE_ENV=production

CMD ["npm", "run", "preview"]
