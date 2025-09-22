FROM node:20-slim AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium


# Comando para iniciar o bot
CMD [ "npm", "start" ]