const Discord = require("discord.js"),
    cooldowns = new Discord.Collection();
let jsoning = require("jsoning");
let db = new jsoning("database/global.json");
module.exports = async(client, message) => {
    if (message.author.bot || message.author === client.user) return;
    let globalprefix = await db.get("prefix")
    let prefix = globalprefix || client.config.bot.prefix;
    var server = message.guild.id;
    require("../addons/master")(client, message)

    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length || prefguild.length).trim().split(/ +/g);
    let msg = message.content.toLowerCase();
    let cmd = args.shift().toLowerCase();
    let sender = message.author;
    let authorid = message.author.id
    let black = require("../database/blacklist.json")
    let blacklist = black.blacklist

    if (blacklist.includes(message.author.id)) {
        const blacklist = new Discord.MessageEmbed()
            .setFooter("DotBot")
            .setColor("YELLOW")
            .setDescription("You in blacklist bot if there is a problem contact me <@754192220843802664>!\n```js\nID Blacklist: " + message.author.id + "```")
            .setTimestamp()
        return message.channel.send({ embeds: [blacklist] })
    }

    if (message.attachments.size > 0) {

        const AttachmentCollection = client.dataAttachment;
        const attachment = Array.from(message.attachments)[0];
        const image = attachment[1].url;
        const format = image.match(/\.(gif|jpe?g|tiff?|png|webp|bmp|mp4|mp3|zip|rar|exe)$/i)[0];
        const toBuffer = await require('got')(image).buffer();

        AttachmentCollection.set(message.id, { buffer: toBuffer, filename: image });
    }

    message.flags = []
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }


    let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

    function runs(commands) {
        client.commands.get(commands).run(client, message, args, prefix);
        return client.commands.get(commands).help
    }

    if (!commandFile) return;
    if (commandFile.conf.developer === true) {
        const youarenot = new Discord.MessageEmbed()
            .setFooter("DotBot")
            .setColor("YELLOW")
            .setDescription("You are not my **Developer**!")
            .setTimestamp()
        if (!client.config.bot.owner.includes(message.author.id)) return message.channel.send({ embeds: [youarenot] });
    }
    if (!message.member.permissions.has(commandFile.conf.permissions)) {
        const Require = new Discord.MessageEmbed()
            .setFooter("DotBot")
            .setColor("YELLOW")
            .setDescription(`Not Enough Permission!\n**Require: ${commandFile.conf.permissions} **`)
            .setTimestamp()
        return message.channel.send({ embeds: [Require] });
    }
    if (!message.guild.me.permissions.has(commandFile.conf.needperms)) {
        const need = new Discord.MessageEmbed()
            .setFooter("DotBot")
            .setColor("YELLOW")
            .setDescription(`The Bot need Permission!\n**Require: ${commandFile.conf.needperms} **`)
            .setTimestamp()
        return message.channel.send({ embeds: [need] });
    }

    if (!cooldowns.has(commandFile.help.name)) cooldowns.set(commandFile.help.name, new Discord.Collection());

    const member = message.member,
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

    if (!timestamps.has(member.id)) {
        if (!client.config.bot.owner.includes(message.author.id)) {
            timestamps.set(member.id, now);
        }
    } else {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`Calm down dude, please wait **${timeLeft.toFixed(1)}** seconds to try the command again.`);
        }

        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount); // This will delete the cooldown from the user by itself.
    }

    try {
        if (!commandFile) return;
        commandFile.run(client, message, args, runs);
    } catch (error) {
        message.channel.send("There was an error while executing this command!")
        console.log(error.message);

    } finally {
        console.log(`${sender.tag} (${sender.id}) ran a command: ${cmd}`);
    }
}