FROM node:current-alpine

# Installer ffmpeg pour la lecture audio
RUN apk update && apk add ffmpeg

# Dossier de travail
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

CMD ["node", "index.js"]
