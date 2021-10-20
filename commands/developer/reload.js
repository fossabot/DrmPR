const Discord = require('discord.js')
let jsoning = require("jsoning");
let db = new jsoning("database/global.json");
const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const danger = new Discord.MessageEmbed()
    .setFooter(`Reload Commands`)
    .setTimestamp()
    .setColor('RED')
    .setDescription("**This function will reload all commands, Reload?**")
const success = new Discord.MessageEmbed()
    .setFooter(`Reload Commands success`)
    .setTimestamp()
    .setColor('GREEN')
    .setDescription("**Reload success!**")
const invite = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel('YES')
        .setCustomId('reloadyes')
        .setStyle('DANGER')
    )
    .addComponents(
        new MessageButton()
        .setLabel('NO')
        .setCustomId('reloadno')
        .setStyle('SUCCESS')
    )
exports.run = async(client, message, args) => {

    message.channel.send({ content: `Confirm Reload`, embeds: [danger], components: [invite] });
    const filter = i => i.user.id === client.config.bot.owner;
    const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });
    collector.on('collect', async i => {
        if (i.customId === 'reloadyes') {
            client.reload()
            await i.update({ embeds: [success], components: [] })
        }
        if (i.customId === 'reloadno') {
            await i.update({ content: "canceled", embeds: [], components: [] })
        }
    });
}

exports.help = {
    name: "reload",
    description: "Reload all commands",
    usage: "[prefix]reload",
    example: "d!reload"
}

exports.slash = false

exports.conf = {
    aliases: ["rl"],
    cooldown: 10,
    developer: true,
    permissions: [""],
    needperms: [""],
}