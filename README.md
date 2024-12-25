### civdrafter

Civdrafter is a really simple discord bot I made for my friends and I so we could draft out civ leaders in a way that's really easy and intuitive

## Prereqs

You need to install the following things into your terminal in order to make sure you can run the bot properly. You'll need node and npm, make sure to check if you have them installed before trying to install the dependencies

```bash
node -v
npm -v
```

# install dependencies

```bash
npm i
npm init -y
npm install discord.js
```

# enviornment variable

The last thing you'll need to do is to create and enviornment and make sure you securely store your discord token inside of it. You can use the following command to create the env file in which you will paste your discord bot ID into

```bash
echo "DISCORD_TOKEN=your-bot-token" > .env
```

After, you will need to run some extra commands and you're all good to run the bot using node.js

```bash
npm install dotenv
```


