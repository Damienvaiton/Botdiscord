FROM node:23-alpine

WORKDIR /app

# Installer les dépendances nécessaires pour l'audio
RUN apk add --no-cache ffmpeg python3 g++ make libtool autoconf automake \
    && apk add --no-cache --virtual .build-deps git curl build-base \
    && apk add --no-cache libsodium-dev opus-dev

# Copier package.json et package-lock.json
COPY package*.json ./


# Installer les dépendances npm
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port si nécessaire
EXPOSE 3000

# Démarrer le bot
CMD ["node", "index.js"]