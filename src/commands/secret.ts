import { ActionRowBuilder, bold, ButtonBuilder, userMention } from '@discordjs/builders';
import { ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { secretMessages } from '../index';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'db.json');

export type SecretMessage = {
    from: string;
    to: string;
    created: Date;
    message: string;
};

export const secretCommand = new SlashCommandBuilder()
    .setName('secret')
    .setDescription('Envía un mensaje secreto para alguien en el canal.')
    .addUserOption((option) => option.setName('user')
        .setDescription('¿Quién puede ver tu mensaje secreto?')
        .setRequired(true))
    .addStringOption((option) => option.setName('message')
        .setDescription('El mensaje secreto a enviar')
        .setRequired(true));

export async function executeSecretCommand(interaction: ChatInputCommandInteraction) {
    try {
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        if (user && message) {
            const secretMessage: SecretMessage = {
                from: interaction.user.id,
                to: user.id,
                created: new Date(),
                message: message,
            };
            
            // Save the message in memory.
            secretMessages[interaction.id] = secretMessage;

            // Backup the message to restore on bot restart
            let temporal: Record<string, SecretMessage> = {};
            try {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                temporal = JSON.parse(fileContent);
                temporal[interaction.id] = secretMessage;
                fs.writeFileSync(filePath, JSON.stringify(temporal, null, 2));
            } catch (error) {
                console.error(error);
            }

            const button = new ButtonBuilder()
                .setCustomId(interaction.id)
                .setLabel('🔒 Revelar mensaje')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(button);

            await interaction.reply({
                content: `✉️ ${bold(interaction.user.displayName)} envió un mensaje secreto a ${userMention(user.id)}`,
                components: [row],
            });
        }
    } catch (error) {
        console.error(error);
    }
}

export async function handleSecretCommandInteraction() {

}
