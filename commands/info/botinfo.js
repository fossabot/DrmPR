const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

exports.run = async(client, message, args) => {
    const mss = await message.channel.send("Calculating...");
    message.channel.sendTyping()
    let m = require('moment-duration-format'),
        os = require('os'),
        cpuStat = require('cpu-stat'),
        ms = require('ms'),
        moment = require('moment'),
        fetch = require('node-fetch')

    cpuStat.usagePercent(function(error, percent, seconds) {
        if (error) {
            return console.error(error)
        }

        const cores = os.cpus().length
        const cpuModel = os.cpus()[0].model
        const guild = client.guilds.cache.size.toLocaleString()
        const user = client.users.cache.size.toLocaleString()
        const channel = client.channels.cache.size.toLocaleString()
        const usage = formatBytes(process.memoryUsage().heapUsed)
        const Node = process.version
        const CPU = percent.toFixed(2)
        const djs = client.package.dependencies["discord.js"];
        let author;

        try {
            const invite = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel('Developer')
                    .setCustomId('dev')
                    .setStyle('SUCCESS')
                )
            const developer = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Developer Status')
                .setAuthor('DemuraAI')
                .setDescription('```js\nName: ' + client.users.cache.get("754192220843802664").username + "#" + client.users.cache.get("754192220843802664").discriminator + '\nID: ' + client.users.cache.get("754192220843802664").id + '```')
                .setTimestamp()
                .setThumbnail(client.users.cache.get("754192220843802664").displayAvatarURL())
                .setFooter("Powered By DRM", message.author.displayAvatarURL());
            const utama = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Status Bot')
                .setAuthor('DemuraAI')
                .setDescription('```js\nName: ' + client.user.username + '\nID: ' + client.user.id + '```')
                .setThumbnail(client.user.displayAvatarURL())
                .addFields({ name: '**Version**', value: client.config.version, inline: true }, { name: '**Kernel**', value: "**ID** " + client.config.kernel + "\n**Version** " + client.config["kernel-version"], inline: true }, )
                .addField('Uptime', `${parseDur(client.uptime)}`, true)
                .addFields({ name: '**Ping**', value: `**Latency** ${mss.createdTimestamp - message.createdTimestamp}ms\n**API** ${Math.floor(client.ws.ping)}ms`, inline: true }, { name: '**Software**', value: `**Discord.js** ${djs}\n**Nodejs** ${Node}`, inline: true }, )
                .addField('Server', `**Guild** ${guild}\n**User** ${user}\n **Channel** ${channel}`, true)
                .addField('System', `**CPU** ${cores} - ${cpuModel}\n**Used** ${CPU}%\n**RAM** ${usage}`, true)
                .setTimestamp()
                .setFooter("Powered By DRM", message.author.displayAvatarURL());
            author = message.author.id
            mss.edit({ content: `Done`, embeds: [utama], components: [invite] });
            const filter = i => i.customId === 'dev' && i.user.id === author
            const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });
            collector.on('collect', async i => {
                if (i.customId === 'dev') {
                    await i.reply({ content: "Donate for give a coffee :coffee:", embeds: [developer], components: [] })
                }
            });


        } catch (error) {
            return message.channel.send(`Something went wrong: ${error.message}`);
        }
    })
}

exports.help = {
    name: "stats",
    description: "Information of the bot",
    usage: "stats",
    example: "stats"
};

exports.slash = false

exports.conf = {
    aliases: ["st"],
    cooldown: 5,
    developer: false,
    permissions: [""],
    needperms: [""],
};

function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    let c = 1024,
        d = b || 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));

    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    let c = 1024,
        d = b || 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));

    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

function parseDur(ms) {
    let seconds = ms / 1000,
        days = parseInt(seconds / 86400);
    seconds = seconds % 86400

    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600

    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60)

    if (days) {
        return `${days} day, ${hours} hours, ${minutes} minutes`
    } else if (hours) {
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds`
    } else if (minutes) {
        return `${minutes} minutes, ${seconds} seconds`
    }

    return `${seconds} second(s)`
}