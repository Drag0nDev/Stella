const {MessageEmbed} = require('discord.js');
const {ServerSettings} = require('../../misc/dbObjects');
const {Permissions} = require('../../misc/tools');
let neededPerm = ['MANAGE_GUILD'];

module.exports = {
    name: 'setleavechannel',
    aliases: ['slc'],
    category: 'server settings',
    description: 'Set the channel where leave messages are sent.\n' +
        'If this is not set and leave messages is set then they won\'t be sent!\n\n' +
        'use `h!slm remove` to disable the elave messages.',
    examples: ['h!slc', 'h!slc #general', 'h!slc remove'],
    neededPermissions: neededPerm,
    run: async (bot, message, args) => {
        let embed = new MessageEmbed().setTitle('Set leave channel')
            .setTimestamp()
            .setColor(bot.embedColors.embeds.normal);
        const choice = new RegExp('remove|[0-9]{17,}');

        if (choice.test(args[0])) {
            if (choice.exec(args[0])[0] === 'remove') {
                await remove(message, embed);
            } else {
                let channel = message.guild.channels.cache.get(choice.exec(args[0])[0]);
                await addChannel(message, channel, embed);
            }
        } else {
            let channel = message.channel;
            await addChannel(message, channel, embed);
        }
    }
}

async function addChannel(message, channel, embed) {
    await ServerSettings.findOne({
        where: {
            serverId: message.guild.id
        }
    }).then(async settings => {
        settings.leaveMessageChannel = channel.id;
        settings.save();

        embed.setDescription(`leave message channel set to <#${channel.id}>`);

        message.channel.send(embed);
    });
}

async function remove(message, embed) {
    await ServerSettings.findOne({
        where: {
            serverId: message.guild.id
        }
    }).then(async settings => {
        settings.leaveMessageChannel = null;
        settings.save();

        embed.setDescription('leave message channel removed!\n' +
            'Join messages will no longer be sent.');

        message.channel.send(embed);
    });
}