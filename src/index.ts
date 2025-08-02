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
import { executeSecretCommand } from './commands/secret';
import { SecretMessage } from './types';
import { clearAllSecretMessages, deleteSecretMessageById, init, readSecretMessageById } from './database';

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
    init(); // Init the database.
    console.log('Gossip bot is online.');
});

client.on(Events.InteractionCreate, async (interactionCreate) => {
    try {
        if (interactionCreate.isChatInputCommand() && interactionCreate.isCommand()) {
            const command = interactionCreate as ChatInputCommandInteraction;

            if (command.commandName === 'secret') {
                await executeSecretCommand(command);
            }
        } else if (interactionCreate.isButton()) {
            const secretMessage = readSecretMessageById(interactionCreate.customId);

            if (secretMessage && (secretMessage.recipient === interactionCreate.user.id || secretMessage.author === interactionCreate.user.id)) {
                return await interactionCreate.reply({
                    content: `🔓 Mensaje secreto: ${spoiler(secretMessage.content ?? '🙁 Ups... este mensaje expiró.')}`,
                    ephemeral: true,
                });
            }

            return await interactionCreate.reply({
                content: `🔓 Mensaje secreto: ${spoiler('🚫 Ninguno, el mensaje no es para ti no seas chismoso(a).')}`,
                ephemeral: true,
            });
        }
    } catch (error) {
        console.error(error);
    }
});

client.on('messageDelete', (messageDelete) => {
    try {
        const id = messageDelete.interactionMetadata?.id;

        if (id) {
            // For cleanup purposes deleted messages should be removed from the database as well.
            const result = deleteSecretMessageById(id);
            console.log(result);
        }
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
