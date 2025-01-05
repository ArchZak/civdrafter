import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { CivCommand } from './CivCommand.js';
import dotenv from 'dotenv';

dotenv.config();

export const leaders = [ //all the civ6 leaders...
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

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ]
});

const commands = new Map();

client.once('ready', () => {
    console.log(`${client.user.tag} is now online`);
    
    const civCommand = new CivCommand(client);
    commands.set(civCommand.name, civCommand);
    
    const commandData = Array.from(commands.values()).map(cmd => cmd.toJSON());
    client.application.commands.set(commandData)
        .then(() => console.log('Slash commands registered!'))
        .catch(console.error);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (command) {
            try {
                if (interaction.guildId === null) {
                    await command.execute(interaction);
                } else {
                    await command.execute(interaction);
                }
            } catch (error) {
                console.error(error);
                const errorMessage = {
                    content: 'There was an error executing this command!',
                    ephemeral: true
                };

                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
    } else if (interaction.isAutocomplete()) {
        const command = commands.get(interaction.commandName);
        if (command?.autocomplete) {
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
