const {MessageEmbed} = require('discord.js');

module.exports = {
    //<editor-fold defaultstate="collapsed" desc="userinfo help">
    name: 'pat',
    category: 'reactions',
    description: 'Pat someone',
    usage: '[command | alias] <mention / id>',
    //</editor-fold>
    run: async (bot, message, args) => {
        let embed = new MessageEmbed().setColor(bot.embedColors.normal);
        let userMentions = [];
        let text;
        let members = '';

        if (args[0]){
            if (message.mentions.users.size > 0) {
                message.mentions.users.forEach(user => {
                    userMentions.push(user.id);
                });
            } else if(message.mentions.roles.size > 0) {
                args.forEach(id => {
                    userMentions.push(id);
                });
            }

            if (userMentions.includes('@everyone')){
                for (let i = 0; i < userMentions.length; i++){
                    if (userMentions[i] === '@everyone')
                        userMentions.splice(i, 1);
                }
            } else if (message.mentions.everyone) {

            }

            if (userMentions[0])
                members = getMentions(userMentions);
            if (message.mentions.roles.size > 0)
                members = getRoles(message.mentions.roles);
        }

        if (message.mentions.everyone)
            members += ' @everyone';

        let author = message.guild.members.cache.get(message.author.id);

        embed.setImage(getGif(bot).toString())
            .setFooter('Powered by lost hopes and dreams');

        if (members.length === 0) {
            userMentions.push(author.user.id)
            text = `*Pats* ${author}!`;
        } else
            text = `${members} you have been patted by **${author.nickname === null ? author.user.username : author.nickname}**!`;

        await message.channel.send(
            {
                content: text,
                embed: embed,
                allowedMentions: {
                    users: userMentions,
                }
            }
        );
    }
}

function getGif(bot) {
    let number = getRandom(Object.keys(bot.reactions.pat).length - 1);

    return bot.reactions.pat[number];
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getMentions(usermentions){
    let members = [];

    usermentions.forEach(id => {
        members.push(`<@!${id}>`)
    });

    return members.join(' ');
}

function getRoles(roleMentions){
    let members = [];

    roleMentions.forEach(role => {
        members.push(`<@&${role.id}>`)
    });

    return members.join(' ');
}