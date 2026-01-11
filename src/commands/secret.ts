import { ActionRowBuilder, bold, ButtonBuilder, spoiler, userMention } from '@discordjs/builders';
import { ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { insertSecretMessage, readSecretMessageById } from '../database';

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
                                .setCustomId(`secret_message_${interaction.id}`)
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

export async function handleSecretMessageButton(interactionCreate: ButtonInteraction<CacheType>) {
    const secretMessage = readSecretMessageById(interactionCreate.customId.replace('secret_message_', ''));

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
