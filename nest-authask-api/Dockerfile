# CONFIGURAÇÃO PARA BUILDAR
FROM node:20.17 AS build

# Área de Trabalho do Docker, a partir daqui tudo que for feito será na pasta /app
WORKDIR /app

# Copiar as dependências do package.json
COPY package.json package-lock.json ./

# Instalar as dependências no Docker
RUN npm install

# Copiar o código fonte e configs
COPY src /app/src
COPY tsconfig.json ./tsconfig.json
COPY .env ./

# Compilar o código
RUN npm run build

# CONFIGURAÇÃO PARA RODAR EM PROD
FROM node:20.17 AS production

WORKDIR /app

# Copiar as dependências do package.json
COPY package.json package-lock.json ./

# Instalar as dependências no Docker
RUN npm install --only=production

# Copiar o código fonte
COPY --from=build /app/dist /app/dist
COPY .env ./

# Expor a porta 3000
EXPOSE 3000

# Rodar o projeto
CMD ["npm", "run", "start:prod"]