const Discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
let jsoning = require("jsoning");
let db = new jsoning("database/global.json");
const wait = require('util').promisify(setTimeout);
exports.run = async(client, message, args, runs) => {
    let bot = client.config.bot;
    let globalprefix = await db.get("prefix")
    let prefix = globalprefix || client.config.bot.prefix;
    let nama = bot.name;
    let author;
    const m = await message.channel.send("Calculating Pings...");
    try {
        const invite = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel('Bot Info')
                .setCustomId('info')
                .setEmoji("🤖")
                .setStyle('SUCCESS')
            )
        const update = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel('Bot Info')
                .setCustomId('up')
                .setEmoji("🤖")
                .setStyle('SUCCESS')
                .setDisabled(true)
            )
        const embed = new Discord.MessageEmbed()
            .setFooter(nama)
            .setColor("GREEN")
            .addField("⌛ Latency", `**${m.createdTimestamp - message.createdTimestamp}ms**`)
            .addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`)
        m.edit({ content: `🏓 Pong!`, embeds: [embed], components: [invite] });
        author = message.author.id
        const filter = i => i.customId === 'info' && i.user.id === author
        const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });
        collector.on('collect', async i => {
            if (i.customId === 'info') {
                i.update({ components: [update] })
                runs("stats")
            }
        });
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
    }

}



exports.slash = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction, client, runs) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        let bot = client.config.bot;
        let prefix = bot.prefix;
        let nama = bot.name;
        const embed = new Discord.MessageEmbed()
            .setFooter(nama)
            .setColor("GREEN")
            .addField("⌛ Latency", sent.createdTimestamp - interaction.createdTimestamp + "ms")
            .addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`)
        interaction.followUp({ embeds: [embed] })
    },
}

exports.help = {
    name: "ping",
    description: "Checkmate the `ms`",
    usage: "ping",
    example: "ping"
}

exports.conf = {
    aliases: ["ms"],
    cooldown: 5,
    developer: false,
    needperms: [""],
    permissions: [""]
}