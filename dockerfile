# 1. Imagem base
FROM node:18-slim

# 2. Define o diretório de trabalho
WORKDIR /usr/src/app

# --- TAREFAS EXECUTADAS COMO ROOT ---

# 3. Instala as dependências do sistema operacional
RUN apt-get update \
    && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libdbus-1-3 \
    libxkbcommon0 libgbm1 libasound2 libexpat1 libx11-6 libxfixes3 \
    libxrandr2 libglib2.0-0 libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 fonts-liberation libxcomposite1 libxdamage1 libxtst6 \
    && rm -rf /var/lib/apt/lists/*

# 4. Copia os arquivos de dependência do projeto e instala
COPY package*.json ./
COPY puppeteer-patch.js ./

RUN npm install

# 5. Copia o restante do código da aplicação, incluindo o patch
COPY . .
RUN npm run build

# 6. Cria o usuário não-root e transfere a propriedade dos arquivos para ele
RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app

# --- FIM DAS TAREFAS DE ROOT ---

# 7. Troca para o usuário não-root
USER appuser

# 8. Define o comando final para iniciar a aplicação
CMD [ "node", "dist/index.js" ]