const { MessageActionRow, MessageButton } = require('discord.js'), { post } = require("node-superfetch");
const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

const embed = new Discord.MessageEmbed()
    .setFooter(`DANGER ZONE`)
    .setTimestamp()
    .setColor('RED')
    .setDescription("**Shuting Down**")
const danger = new Discord.MessageEmbed()
    .setFooter(`Shutdown`)
    .setTimestamp()
    .setColor('YELLOW')
    .setDescription("**Are you sure?**")
    // This command is super frickin' dangerous. Make it only visible and usable for you only, or give it to someone you trust.

const invite = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel('YES')
        .setCustomId('offyes')
        .setStyle('DANGER')
    )
    .addComponents(
        new MessageButton()
        .setLabel('NO')
        .setCustomId('offno')
        .setStyle('SUCCESS')
    )


exports.run = async(client, message, args) => {
    let bot = client.config.bot;
    let prefix = bot.prefix;
    let nama = bot.name;
    let id = client.user.id

    message.channel.send({ content: `Confirm Shutdown`, embeds: [danger], components: [invite] });
    const filter = i => i.user.id === client.config.bot.owner;
    const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });

    collector.on('collect', async i => {
        if (i.customId === 'offyes') {
            await i.update({ content: "Bye", embeds: [embed], components: [] })
            process.exit(0)
        }
        if (i.customId === 'offno') {
            await i.update({ content: "canceled", embeds: [], components: [] })
        }
    });

}


exports.help = {
    name: "shutdown",
    description: "Shutdown Bot.",
    usage: "[prefix]shutdown",
    example: "[prefix]shutdown"
}

exports.slash = false

exports.conf = {
    aliases: ["kill"],
    developer: true,
    permissions: [""],
    needperms: [""],
}

function clean(string) {
    if (typeof text === "string") {
        return string.replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
        return string;
    }
}