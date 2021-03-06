const {MessageEmbed} = require('discord.js');
const {Category} = require('../../misc/dbObjects');
const config = require("../../../config.json");
const {Permissions} = require('../../misc/tools');
const logger = require("log4js").getLogger();

module.exports = {
    name: 'addcategory',
    aliases: ['ac'],
    category: 'ownershop',
    description: 'Add an category to the shop',
    usage: '[command | alias] [categoryname}',
    examples: ['h!ac Background'],
    ownerOnly: true,
    run: async (bot, message, args) => {
        const name = args.join(' ').toLowerCase();
        let db;
        let embed = new MessageEmbed().setTitle('Add category');

        db = await Category.findOne({
            where: {
                name: name
            }
        }).catch(err => {
            logger.error(err);
        });

        if (db !== null) {
            embed.setDescription(`The category **${name}** already existh!`)
                .setColor(bot.embedColors.embeds.error);

            return await message.channel.send(embed);
        }

        Category.create({
            name: name
        }).then(cat => {
            embed.setDescription(`The category **${cat.name}** created!`)
                .setColor(bot.embedColors.logs.logAdd);

            message.channel.send(embed);
        }).catch(err => {
            logger.error(err);
        });
    }
}