const leaders = [ //all the civ6 leaders...
    "america-bullmoose",
    "america-lincoln",
    "america-roughrider",
    "arabia-sultan",
    "arabia-vizier",
    "australia",
    "aztec",
    "babylon",
    "brazil",
    "byzantine-basil",
    "byzantine-theodora",
    "canada",
    "china-kublai",
    "china-mandate",
    "china-unifer",
    "china-yongle",
    "china-zetian",
    "dutch",
    "egypt-ramses",
    "english-eleanor",
    "english-empire",
    "english-steam",
    "ethiopia",
    "french-blackqueen",
    "french-eleanor",
    "french-magnificence",
    "gaul",
    "georgia",
    "germany-frederick",
    "germany-ludwig",
    "greek-gorgo",
    "greek-pericles",
    "grancolombia",
    "hungary",
    "inca",
    "india-chandragupta",
    "india-ghandi",
    "indonesia",
    "japan-hojo",
    "japan-tokugawa",
    "khmer",
    "kongo-mvemba",
    "kongo-nzinga",
    "korea-sejong",
    "korea-seondeok",
    "macedon",
    "mali-keita",
    "mali-mansamusa",
    "maori",
    "mapuche",
    "mayan",
    "mongolia-genghis",
    "mongolia-kublai",
    "norway-konge",
    "norway-varangian",
    "nubia",
    "persia-cyrus",
    "persia-nadar",
    "phoenicia",
    "polish",
    "portugal",
    "poundmaker",
    "ptolemaic-cleopatra",
    "roman-trajan",
    "rome-ceasar",
    "russia",
    "scotland",
    "scythia",
    "spain",
    "sumeria",
    "sweden",
    "vietnam",
    "zulu"
];

const Discord = require('discord.js'); 
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;

const Client = new Discord.Client({ //discord.js imports
    intents: [
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
    ], partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.ThreadMember,
    ]
}); 

Client.on('ready', (client) => console.log(client.user.tag + ' is now online'));

Client.on('messageCreate', (message) => {  //scans every message typed in any channel the bot has access to
    if (message.content === '?help') {
        message.reply(
            "Use `?draft X Y LeaderName1 LeaderName2 etc` to create a draft. "+ 
            "X is the amount of players to draft for, and Y is the amount of civs to assign to each player. The leader names after are the bans, you can type any amount of bans." +
            "\n\nUse `?listleaders` in order to see all the civ leaders that are available,"+
            " and the names you need to copy and paste into the leader ban.");
    } else if (message.content === "?listleaders") {
        message.reply(leaders.map((leader, index) => `${index + 1}. ${leader}`).join("\n"));
    }

    const messageContents = (message.content).split(" ");

    if (messageContents[0] === '?draft') {
        const playerAmount = messageContents[1]; 
        const civAmount = messageContents[2];
        if (playerAmount < 0 || civAmount < 0) {
            return message.reply("negative number detected, try again");
        }

        const bannedLeaders = messageContents.slice(3).map(ban => ban.toLowerCase());

        const availableLeaders = leaders.filter(leader => //makes sure dupe leaders arent handed out
            !bannedLeaders.includes(leader.toLowerCase())
        );

        if (availableLeaders.length < playerAmount * civAmount) {
            return message.reply("not enough leaders available after bans to complete draft");
        }

        const draftResults = [];
        for (let i = 0; i < playerAmount; i++) {
            const playerDraft = []; //assigns civs to each player at random
            for (let j = 0; j < civAmount; j++) {
                const randomNumber = Math.floor(Math.random() * availableLeaders.length);
                playerDraft.push(availableLeaders[randomNumber]);
                availableLeaders.splice(randomNumber, 1); 
            }
            draftResults.push(`Player ${i + 1}: ${playerDraft.join(", ")}`); 
        }

        message.reply(draftResults.join("\n"));
    }
    }
); 

Client.login(token); 