import dotenv from 'dotenv';
import {
    Client,
    Events,
    GatewayIntentBits,
} from 'discord.js';
import './deployCommands';
import { executeSecretCommand, handleSecretMessageButton } from './commands/secret';
import { SecretMessage } from './types';
import { deleteSecretMessageById, initDatabase } from './database';
import { executeMoodCommand, handleMoodSelect } from './commands/mood';

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
    initDatabase();
    console.log('Gossip bot is online.');
});

client.on(Events.InteractionCreate, async (interactionCreate) => {
    try {
        if (interactionCreate.isChatInputCommand() && interactionCreate.isCommand()) {
            if (interactionCreate.commandName === 'secret') {
                await executeSecretCommand(interactionCreate);
            } else if (interactionCreate.commandName === 'mood') {
                await executeMoodCommand(interactionCreate);
            }
        } else if (interactionCreate.isButton()) {
            if (interactionCreate.customId.startsWith('secret_message_')) {
                handleSecretMessageButton(interactionCreate);
            }
        } else if (interactionCreate.isStringSelectMenu()) {
            if (interactionCreate.customId.startsWith('mood_select')) {
                handleMoodSelect(interactionCreate);
            }
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
