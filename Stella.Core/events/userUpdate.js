const {User} = require('../misc/dbObjects');
const logger = require("log4js").getLogger();
const {MessageEmbed} = require('discord.js');
const tools = require("../misc/tools");

module.exports = async (bot, oldMember, newMember) => {
    await usernameUpdate(bot, oldMember, newMember);
}

async function usernameUpdate(bot, oldMember, newMember) {
    try {
        await User.findOne({
            where: {
                userId: oldMember.id
            }
        }).then(dbMember => {
            dbMember.userTag = `${newMember.username}#${newMember.discriminator}`;
            dbMember.save();
        }).catch(err => {
            User.create({
                userTag: `${newMember.username}#${newMember.discriminator}`,
                userId: newMember.id
            });
        });

        await bot.guilds.cache.forEach(guild => {
            if (guild.members.cache.get(newMember.id)) {
                if (oldMember.username !== newMember.username) {
                    let embed = new MessageEmbed().setTimestamp()
                        .setColor(bot.embedColors.logChange)
                        .setAuthor(`${newMember.username}#${newMember.discriminator}`,
                            newMember.avatarURL({dynamic: true}),
                            newMember.avatarURL({dynamic: true, size: 4096}))
                        .setTitle('Username changed')
                        .addField('Old username', oldMember.username)
                        .addField('New username', newMember.username)
                        .setFooter(`ID: ${newMember.id}`);

                    tools.memberLogGuild(newMember, guild, embed);
                }
                if (oldMember.discriminator !== newMember.discriminator) {
                    let embed = new MessageEmbed().setTimestamp()
                        .setColor(bot.embedColors.logChange)
                        .setAuthor(`${newMember.username}#${newMember.discriminator}`,
                            newMember.avatarURL({dynamic: true}),
                            newMember.avatarURL({dynamic: true, size: 4096}))
                        .setTitle('Discriminator changed')
                        .addField('Old discriminator', oldMember.discriminator)
                        .addField('New discriminator', newMember.discriminator)
                        .setFooter(`ID: ${newMember.id}`);

                    tools.memberLogGuild(newMember, guild, embed);
                }

            }
        });
    } catch (err) {
        logger.error(err);
    }
}