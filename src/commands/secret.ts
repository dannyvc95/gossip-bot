import { ActionRowBuilder, bold, ButtonBuilder, userMention } from '@discordjs/builders';
import { ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { insertSecretMessage } from '../database';

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
        // Get command input values.
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        if (user && message) {
            // Save the secret message in the database.
            insertSecretMessage({
                id: interaction.id,
                author: interaction.user.id,
                recipient: user.id,
                timestamp: new Date(),
                content: message,
            });

            return await interaction.reply({
                content: `✉️ ${bold(interaction.user.displayName)} envió un mensaje secreto a ${userMention(user.id)}`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(interaction.id)
                                .setLabel('🔒 Revelar mensaje')
                                .setStyle(ButtonStyle.Primary)
                        )
                ],
            });
        }
    } catch (error) {
        console.error(error);
    }
}
