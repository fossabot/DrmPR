const discord = require('discord.js')
module.exports = async(client, message) => {

    if (!client.config.bot.owner.includes(message.author.id)) return;

    if (message.content === "hello") {
        message.channel.sendTyping();
        message.reply({ content: "Welcome back master" })
    }
}