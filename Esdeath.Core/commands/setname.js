const config = {
    owner: process.env.OWNER
};

exports.run = (bot, message, args) => {
    if(message.member.id === config.owner.toString()){
        bot.user.setUsername(args.toString());
        message.channel.send('Username changed successfully!');
    }else{
        message.channel.send(`${message.author} this is a command only for my creator!`);
    }
}

exports.help = {
    name: 'setName'
}