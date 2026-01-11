import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { secretCommand } from './commands/secret';
import { moodCommand } from './commands/mood';

dotenv.config();

const commands = [
    secretCommand.toJSON(),
    moodCommand.toJSON(),
];

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
    try {
        console.log('Deploying commands.');
        console.log(commands.map(({ name }) => name));
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: commands });
    } catch (error) {
        console.error(error);
    }
})();
