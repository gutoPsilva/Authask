# Etapa 1: Construção do projeto Angular
FROM node:20.17 AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar o código-fonte
COPY . .

# Expor a porta em que o aplicativo Angular será executado
EXPOSE 4200

# Comando para iniciar o servidor de desenvolvimento do Angular
CMD ["npm", "run", "start:prod"]
