const { MessageEmbed } = require("discord.js");
const {ServerUser} = require('../../misc/dbObjects');
const tools = require('../../misc/tools');

module.exports = {
    name: 'ban',
    category: 'moderation',
    description: 'ban a member from the server',
    usage: '[command | alias] [Member mention/id] <reason>',
    neededPermissions: ['BAN_MEMBERS'],
    run: async (bot, message, args) => {
        let reason;
        let embed = new MessageEmbed().setTimestamp().setColor(bot.embedColors.ban).setTitle('User banned');
        let guild = message.guild;

        //check if there is an argument
        if (!args[0])
            return message.channel.send('Please provide a user to ban!');

        //check member permissions
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.channel.send(`${message.author} you do not have the **ban** permission!`);
        }

        //check bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.channel.send('I do not have the required permission to ban members!');
        }

        let member;

        await tools.getMember(message, args).then(memberPromise => {
            member = memberPromise;
        });
        const author = message.guild.members.cache.get(message.author.id);

        //check if member is in the server
        if (!member) {
            return message.channel.send("No member found with this id/name!");
        }

        const canBan = tools.compareRoles(author, member);

        //check if member is banable
        if (!member.bannable) {
            return message.channel.send(`I can't ban **${member.user.tag}** due to role hierarchy!`);
        }

        //check if it is self ban, or bot ban
        if (member.user.id === message.author.id) {
            return message.channel.send("You can't ban yourself");
        }

        //check if the author has a higher role then the member
        if (!canBan)
            return message.channel.send(`You can't kick **${member.user.tag}** due to role hierarchy!`);

        args.shift();

        //set reason
        if (!args[0]) {
            reason = 'No reason provided';
        } else {
            reason = args.join(' ');
        }

        const dmChannel = await member.createDM()
        await dmChannel.send(`You got banned from **${guild.name}** with reason: **${reason}**!`);
        
        await member.ban({
            days: 7,
            reason: `${reason}`
        });

        message.channel.send(`**${member.user.tag}** got banned for reason: **${reason}**`);

        embed.setDescription(`**Member:** ${member.user.tag}\n` +
                `**Reason:** ${reason}\n` +
                `**Responsible moderator:** ${message.author.tag}`)
            .setFooter(`ID: ${member.id}`);

        const channel = bot.channels.cache.find(channel => channel.id === '763039768870649856');
        await channel.send(embed);

        await ServerUser.destroy({
            where: {
                userId: member.user.id
            }
        });
    }
}