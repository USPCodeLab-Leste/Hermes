FROM node:24.13.0-alpine

# diretório da aplicação
WORKDIR /app

# instala dependências
COPY package*.json ./
RUN npm install

# copia o resto do código
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
