const {MessageEmbed} = require('discord.js');
let neededPerm = ['MANAGE_EMOJIS'];
const logger = require("log4js").getLogger();

module.exports = {
    name: 'emojicreate',
    aliases: ['ec', 'steal'],
    category: 'emojis',
    description: 'Create a new emoji or add one that already exists.',
    usage: '[command | alias] [name/emoji] <link/attachment>',
    examples: ['h!ec Laughing <image>'],
    neededPermissions: neededPerm,
    run: async (bot, message, args) => {
        const emoji = {
            send: async function (msg) {
                await message.channel.send(msg);
            },
            getAttLink: async function (msg) {
                const att = msg.attachments.first();
                return att.url;
            },
            embed: new MessageEmbed().setTitle('Emoji create')
                .setColor(bot.embedColors.embeds.normal)
                .setTimestamp(),
            name: args[0],
            link: args[1] ? args[1] : '',
            str: args.join(' '),
            colors: {
                normal: bot.embedColors.embeds.normal,
                error: bot.embedColors.embeds.error
            },
            regs: {
                emoji: new RegExp('<a:.+?:\\d+>|<:.+?:\\d+>'),
                animated: new RegExp('<a:.+?:\\d+>'),
                id: new RegExp('\\d+'),
                name: new RegExp(':.+?:'),
                pictureUrl: new RegExp('\.(jpeg|jpg|gif|png)$'),
                replace: new RegExp(':', 'g')
            },
            guild: message.guild
        };

        if (emoji.regs.emoji.test(emoji.str)) {
            await emojiFunct(emoji)
        } else if (emoji.name !== '' && message.attachments.size > 0) {
            emoji.link = await emoji.getAttLink(message);
        } else if (emoji.name !== '' && emoji.link !== '') {
            if (!emoji.regs.pictureUrl.test(emoji.link)) {
                emoji.embed.setColor(emoji.colors.error)
                    .setDescription('Please provide a valid link.');
                return emoji.send(emoji.embed);
            }
        } else {
            emoji.embed.setColor(emoji.colors.error)
                .setDescription('Please provide valid arguments.\n' +
                    'The following methods are allowed:\n' +
                    '**Emoji**: provide the emoji you want to add from another server.\n' +
                    '**Name + picture**: give the name for the emoji and picture for the emoji.\n' +
                    '**Name + link**: give the name for the emoji and the link to the picture.');

            return emoji.send(emoji.embed);
        }

        emoji.guild.emojis.create(emoji.link, emoji.name)
            .then(newEmoji => {
                emoji.embed.setDescription(`Emoji with name **${emoji.name}** is added to the server`)
                    .setThumbnail(newEmoji.url);
                emoji.send(emoji.embed);
            })
            .catch(error => {
                emoji.embed.setDescription(error.message)
                    .setColor(emoji.colors.error);
                emoji.send(emoji.embed);
                logger.error(error);
            });
    }
}

async function emojiFunct(emoji) {
    if (emoji.regs.animated.test(emoji.str)) {
        emoji.link = `https://cdn.discordapp.com/emojis/${emoji.regs.id.exec(emoji.regs.animated.exec(emoji.str)[0])}.gif`;
    } else {
        emoji.link = `https://cdn.discordapp.com/emojis/${emoji.regs.id.exec(emoji.regs.emoji.exec(emoji.str)[0])}.png`;
    }

    if (emoji.name === emoji.regs.emoji.exec(emoji.str)[0]) {
        emoji.name = emoji.regs.name.exec(emoji.regs.emoji.exec(emoji.str)[0])[0].replace(emoji.regs.replace, '');
    }
}