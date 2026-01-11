import { ActionRowBuilder, bold, EmbedBuilder, userMention } from '@discordjs/builders';
import { CacheType, ChatInputCommandInteraction, Colors, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';

export type Mood =
    | 'happy'
    | 'motivated'
    | 'tired'
    | 'bored'
    | 'stressed'
    | 'sad'
    | 'angry'
    | 'random';

export const MOODS = {
    happy: {
        label: 'Feliz',
        emoji: '😄',
        img: 'https://media.tenor.com/dEN66mMlhB8AAAAi/i-love-you.gif',
        texts: [
            'anda feliz como lombriz 😄',
            'hoy todo le sale bien ✨',
            'irradiando buena vibra 🌈',
            'con una sonrisa imposible de ocultar 😁',
            'en modo felicidad desbloqueada 🎉',
        ],
    },
    motivated: {
        label: 'Motivado / Motivada',
        emoji: '😎',
        img: 'https://media.tenor.com/d4oQ9dYvB5UAAAAi/peach-goma.gif',
        texts: [
            'listo para comerse el mundo 💪',
            'con la motivación al máximo 🚀',
            'nadie lo para hoy 🔥',
            'en modo productividad extrema 🧠',
            'con energía de protagonista 😎',
        ],
    },
    tired: {
        label: 'Cansado / Cansada',
        emoji: '😴',
        img: 'https://media.tenor.com/Y8WQ1xwb0LkAAAAi/sleepy-cat.gif',
        texts: [
            'necesita dormir mínimo 12 horas 🛌',
            'funcionando a base de café ☕',
            'con batería social al 1% 🔋',
            'modo zombie activado 🧟',
            'sobreviviendo, no viviendo 😵‍💫',
        ],
    },
    bored: {
        label: 'Aburrido / Aburrida',
        emoji: '🥱',
        img: 'https://media.tenor.com/qqaSwbUrlJwAAAAi/peach.gif',
        texts: [
            'contando los minutos ⏳',
            'aburrido nivel existencial 🫠',
            'nada pasa, pero pasa el tiempo 🕰️',
            'esperando que algo ocurra 👀',
            'en modo “meh” 😐',
        ],
    },
    stressed: {
        label: 'Estresado / Estresada',
        emoji: '😵‍💫',
        img: 'https://media.tenor.com/NDCZITrWnwkAAAAi/peach-goma-peach-and-goma.gif',
        texts: [
            'a dos correos de colapsar 📩',
            'con demasiadas cosas en la cabeza 🧠',
            'necesita vacaciones urgentes 🏖️',
            'el estrés ya tomó el control ⚠️',
            'en modo caos 🌀',
        ],
    },
    sad: {
        label: 'Triste',
        emoji: '😔',
        img: 'https://media.tenor.com/GpkaEEv2pCoAAAAi/peach-goma.gif',
        texts: [
            'con el ánimo por los suelos 😔',
            'no está teniendo un buen día 🌧️',
            'necesita un abrazo urgente 🫂',
            'todo pesa un poco más hoy 💔',
            'en modo bajón 🫠',
        ],
    },
    angry: {
        label: 'Enojado / Enojada',
        emoji: '😠',
        img: 'https://media.tenor.com/IviqlJKGm1AAAAAi/peach-and-goma-peach-goma.gif',
        texts: [
            'hmm 😠',
            'con paciencia negativa 🚫',
            'todo le molesta 😤',
            'un comentario más y explota 💥',
            'en modo furia 🔥',
        ],
    },
    random: {
        label: 'Random',
        emoji: '🎲',
        img: 'https://media.tenor.com/xfrgDqWMIpoAAAAi/peach-goma.gif',
        texts: [
            'no sabe cómo se siente 🤷',
            'emocionalmente impredecible 🎭',
            'en piloto automático 🤖',
            'en modo misterio 🧩',
            'en modo NPC 🧍',
        ],
    },
} as const;

export const moodCommand = new SlashCommandBuilder()
    .setName('mood')
    .setDescription('Comparte tu estado de ánimo.')

export async function executeMoodCommand(interaction: ChatInputCommandInteraction) {
    try {
        // Get mood value.
        const moodSelect = new StringSelectMenuBuilder()
            .setCustomId('mood_select')
            .setPlaceholder('Elegir estado de ánimo')
            .addOptions(
                { label: 'Feliz', value: 'happy', emoji: '😄' },
                { label: 'Motivado / Motivada', value: 'motivated', emoji: '😎' },
                { label: 'Cansado / Cansada', value: 'tired', emoji: '😴' },
                { label: 'Aburrido / Aburrida', value: 'bored', emoji: '🥱' },
                { label: 'Estresado / Estresada', value: 'stressed', emoji: '😵‍💫' },
                { label: 'Triste', value: 'sad', emoji: '😔' },
                { label: 'Enojado / Enojada', value: 'angry', emoji: '😠' },
                { label: 'Random', value: 'random', emoji: '🎲' },
            );

        return await interaction.reply({
            content: `${bold(interaction.user.displayName)}, ¿cómo te sientes?`,
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(moodSelect)
            ],
        });
    } catch (error) {
        console.error(error);
    }
}

export async function handleMoodSelect(interaction: StringSelectMenuInteraction<CacheType>) {
    const mood = interaction.values[0] as Mood;
    const randomText = MOODS[mood].texts[Math.floor(Math.random() * MOODS[mood].texts.length)];
    const embed = new EmbedBuilder()
        .setTitle(bold(`${MOODS[mood].label} ${MOODS[mood].emoji}`))
        .setDescription(`${userMention(interaction.user.id)} ${randomText}`)
        .setColor(Colors.Purple)
        .setImage(MOODS[mood].img);
    return await interaction.reply({ embeds: [embed] })
}