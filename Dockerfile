FROM node:23-alpine3.20

WORKDIR /usr/src/app

RUN npm init -y
RUN npm install discord.js
RUN echo "DISCORD_TOKEN=your-bot-token" > .env
RUN npm install dotenv

COPY . .

RUN node civ.js
