const config = {
    prefix: process.env.PREFIX,
    botId: process.env.BOTID
};

module.exports = (bot, message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix.toString()) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(args)
    const cmd = bot.commands.get(command);
    if (!cmd) return;

    console.log(`------------------------------\nCommand: '${command}'\nArguments: '${args}' \nUser: '${message.author.tag}' \nServer: '${message.guild.name}' \nChannel: '${message.channel.name}'`);
    cmd.run(bot, message, args);
};