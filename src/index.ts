import dotenv from 'dotenv';
import {
    ChatInputCommandInteraction,
    Client,
    Events,
    GatewayIntentBits,
    MessageFlags,
    spoiler,
    userMention,
} from 'discord.js';
import './deployCommands';
import { executeSecretCommand, SecretMessage } from './commands/secret';

dotenv.config();

export const secretMessages: Record<string, SecretMessage> = {};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, async () => {
    console.log('Gossip bot is online.');
});

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        if (interaction.isChatInputCommand() && interaction.isCommand()) {
            const command = interaction as ChatInputCommandInteraction;

            if (command.commandName === 'secret') {
                await executeSecretCommand(command);
            }
        } else if (interaction.isButton()) {
            const secretMessage = secretMessages[interaction.customId];

            if (secretMessage && (secretMessage.to === interaction.user.id || secretMessage.from === interaction.user.id)) {
                return await interaction.reply({
                    content: `🔓 Mensaje secreto: ${spoiler(secretMessage.message ?? '🙁 Ups... este mensaje expiró.')}`,
                    ephemeral: true,
                });
            }

            return await interaction.reply({
                content: `🔓 Mensaje secreto: ${spoiler('🚫 Ninguno, el mensaje no es para ti no seas chismoso(a).')}`,
                ephemeral: true,
            });
        }
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
