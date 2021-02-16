const logger = require("log4js").getLogger();
const {MessageEmbed} = require('discord.js');
const {Logs, Minor} = require("../misc/tools");

module.exports = async (bot, role) => {
    try {
        let embed = new MessageEmbed().setTimestamp()
            .setColor(bot.embedColors.logRemove)
            .setTitle(`Role deleted`)
            .setFooter(`Role ID: ${role.id}`)
            .addField('Name', role.name, true)
            .addField('Color', Minor.getHex(role), true)
            .addField('Mentionable', role.mentionable ? 'Yes' : 'No', true)
            .addField('Displayed separetly', role.hoist ? 'Yes' : 'No', true)
            .addField('Position', role.rawPosition, true);

        await Logs.serverLog(role.guild, embed);
    } catch (err) {
        logger.error(err);
    }
}