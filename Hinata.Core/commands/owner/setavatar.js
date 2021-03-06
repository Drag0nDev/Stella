const config = require("../../../config.json");
const {Permissions} = require('../../misc/tools');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'setavatar',
    aliases: ['changeavatar', 'newavatar'],
    category: 'owner',
    description: 'Command to change Esdeaths profilepicture',
    usage: '[command | alias] [link new picture]',
    ownerOnly: true,
    run: async (bot, message, args) => {
        let embed = new MessageEmbed();

        bot.user.setAvatar(args.toString()).then(updated => {
                embed.setTitle(`setavatar`)
                    .setColor(bot.embedColors.embeds.normal)
                    .setDescription('Avatar changed successfully to:')
                    .setImage(updated.avatarURL({dynamic: true, size: 4096}));

                message.channel.send(embed);
            }
        ).catch(err => {
            embed.setDescription(err)
                .setColor(bot.embedColors.embeds.error);
            message.channel.send(embed);
        })

    }
}