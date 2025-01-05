import BaseCommand from './BaseCommand.js';
import { EmbedBuilder } from 'discord.js';
import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { leaders } from './civ.js';

export class CivCommand extends BaseCommand {
    constructor(client) {
        const banOptions = Array.from({ length: 10 }, (_, i) => ({
            name: `ban${i + 1}`,
            description: `Banned leader #${i + 1}`,
            required: false,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        }));

        super(client, {
            name: 'civ',
            description: 'Commands to be used for the draft',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'help',
                    description: 'shows all commands',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'listleaders',
                    description: 'lists all civ leaders',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'draft',
                    description: 'drafts for players',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'players',
                            description: 'number of players',
                            required: true,
                            type: ApplicationCommandOptionType.Integer,
                            minValue: 1,
                            maxValue: 24,
                        },
                        {
                            name: 'civs',
                            description: 'number of civs per player',
                            required: true,
                            type: ApplicationCommandOptionType.Integer,
                            minValue: 1,
                        },
                        ...banOptions,
                    ],
                },
            ],
            default_member_permissions: "0",
        });
    }

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const subcommand = interaction.options.getSubcommand();

        const handlers = {
            help: () => this.help(interaction),
            listleaders: () => this.listLeaders(interaction),
            draft: () => this.draft(interaction),
        };

        return handlers[subcommand]?.();
    }

    async help(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription(
                "Use `/draft X Y LeaderName1 LeaderName2 etc` to create a draft. "+ 
                "X is the amount of players to draft for, and Y is the amount of civs to assign to each player. The leader names after are the bans, you can type any amount of bans." +
                "\n\nUse `/listleaders` in order to see all the civ leaders that are available, keep in mind that these are all the leaders that are in the game with DLCs."
            )
            .setColor("Random");

        return interaction.editReply({ embeds: [embed] });
    }

    async listLeaders(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Leaders List")
            .setDescription(leaders.map((leader, index) => `${index + 1}. ${leader}`).join("\n"))
            .setColor("Random");

        return interaction.editReply({ embeds: [embed] });
    }

    async draft(interaction) {
        const playerAmount = interaction.options.getInteger('players');
        const civAmount = interaction.options.getInteger('civs');
        
        const bannedLeaders = Array.from({ length: 10 }, (_, i) => 
            interaction.options.getString(`ban${i + 1}`)
        ).filter(Boolean);

        const availableLeaders = leaders.filter(
            leader => !bannedLeaders.includes(leader)
        );

        if (availableLeaders.length < playerAmount * civAmount) {
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Not enough leaders available after bans to complete draft.")
                .setColor('Red');

            return interaction.editReply({ embeds: [embed] });
        }

        const shuffledLeaders = [...availableLeaders].sort(() => Math.random() - 0.5);
        const draftResults = Array.from({ length: playerAmount }, (_, i) => {
            const start = i * civAmount;
            const playerLeaders = shuffledLeaders.slice(start, start + civAmount);
            return `**Player ${i + 1}:** \`${playerLeaders.join(", ")}\``;
        });

        const embed = new EmbedBuilder()
            .setTitle("Civ Draft")
            .setDescription(draftResults.join("\n\n"))
            .setColor("Random");

        return interaction.editReply({ embeds: [embed] });
    }

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        if (!focusedOption.name.startsWith('ban')) return;

        const focusedValue = focusedOption.value.toLowerCase();
        const filteredLeaders = leaders
            .filter(leader => 
                leader.toLowerCase().startsWith(focusedValue)
            )
            .slice(0, 25);

        await interaction.respond(
            filteredLeaders.map(leader => ({ 
                name: leader, 
                value: leader 
            }))
        );
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            type: this.type,
            options: this.options,
        };
    }
}