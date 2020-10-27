const {MessageEmbed} = require('discord.js');

module.exports = {
    //<editor-fold defaultstate="collapsed" desc="userinfo help">
    name: 'hug',
    category: 'Reactions',
    description: 'Hug someone',
    usage: '[command | alias] <mention / id>',
    //</editor-fold>
    run: async (bot, message, args) => {
        let embed = new MessageEmbed().setColor(bot.embedColors.normal);

        let text;

        let member = !args[0] ? message.guild.members.cache.get(message.author.id) : message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        let author = message.guild.members.cache.get(message.author.id);

        embed.setImage(getGif(bot).toString())
            .setFooter('Powered by lost hopes and dreams');

        if (!args[0])
            text = `*kisses* ${author}!`;
        else
            text = `<@!${member.id}> you have been kissed by **${author.nickname}**!`;

        await message.channel.send(
            {
                content: text,
                embed: embed
            }
        );
    }
}

function getGif(bot) {
    let number = getRandom(Object.keys(bot.reactions.kiss).length);
    return bot.reactions.kiss[number];
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}