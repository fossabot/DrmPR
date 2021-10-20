const Discord = require('discord.js')
let jsoning = require("jsoning");
let db = new jsoning("database/global.json");
let dbb = new jsoning("database/blacklist.json");
const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const invite = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel('YES')
        .setCustomId('yes')
        .setStyle('DANGER')
    )
    .addComponents(
        new MessageButton()
        .setLabel('NO')
        .setCustomId('no')
        .setStyle('SUCCESS')
    )
exports.run = async(client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(":gear: Global Settings")
        .setColor('GREEN')
        .setDescription("```status``` \n```Activity``` \n```globalpref``` \n```nac```\n```blacklist```")
        .setFooter(`DemuraAI.`, client.user.displayAvatarURL())
    const invite = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('YES')
            .setCustomId('gsetyes')
            .setStyle('DANGER')
        )
        .addComponents(
            new MessageButton()
            .setLabel('NO')
            .setCustomId('gsetno')
            .setStyle('SUCCESS')
        )
    let list = new Discord.MessageEmbed()
        .setFooter(`Commands`)
        .setTimestamp()
        .setTitle("List Commands")
        .setColor('RED')
        .setDescription("```" + client.commands + "```")
    if (!args[0]) return message.channel.send({ embeds: [embed] });
    let choice = ["status", "blacklist", "activity", "globalpref", "nac"];
    if (!choice.includes(args[0].toLowerCase())) return message.channel.send("Unknown parameter");

    let text = args.slice(1).join(" ");

    if (!text) return message.channel.send("Please input args.");

    if (text.length > 1024) return message.channel.send("Oww, that is too much. The maximium character was 1,204.");

    if (args[0].toLowerCase() == "status") {
        db.set('status', args.slice(1).join(" "))
        return message.channel.send("settings Update!")
    }
    if (args[0].toLowerCase() == "blacklist") {
        dbb.push('blacklist', args.slice(1).join(" "))
        return message.channel.send("Adding to database!")
    }
    if (args[0].toLowerCase() == "activity") {
        db.set('activity', args.slice(1).join(" "))
        return message.channel.send("settings Update!")
    }
    if (args[0].toLowerCase() == "globalpref") {
        await db.set('prefix', args.slice(1).join(" "))
        await db.set("log", `Change Global Prefix to ` + args.slice(1).join(" "))
        return message.channel.send("settings Update!")
    }
    if (args[0].toLowerCase() == "nac") {
        if (client.commands.get(args.slice(1).join(" ")) === undefined) return message.channel.send("Commands Not found");
        message.channel.send({ content: `Confirm disable command ` + args.slice(1).join(" "), components: [invite] });
        const filter = i => i.user.id === client.config.bot.owner;
        const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });
        collector.on('collect', async i => {
            if (i.customId === 'gsetyes') {
                let mss = await i.update({ content: `Mematikan command ` + args.slice(1).join(" ") + "...", components: [] })
                client.commands.delete(args.slice(1).join(" "))
            }
            if (i.customId === 'gsetno') {
                await i.update({ content: "canceled", embeds: [], components: [] })
            }
        });
    }
}

exports.slash = {
    data: new SlashCommandBuilder()
        .setName('gset')
        .setDescription('Global settings (Only Developer)')
        .addStringOption(option =>
            option.setName('prefix')
            .setDescription('set prefix'))
        .addStringOption(option =>
            option.setName('blacklist')
            .setDescription('Add blacklist user'))
        .addStringOption(option =>
            option.setName('nac')
            .setDescription('Disable commands')),
    async execute(interaction, client, runs) {
        const prefix = interaction.options.getString('prefix');
        const nac = interaction.options.getString('nac');
        const blacklist = interaction.options.getString('blacklist');
        if (!interaction.isCommand()) return;
        if (interaction.commandName === 'gset') {
            if (prefix) {
                await db.set('prefix', prefix)
                await db.set("log", `Change Global Prefix to ` + prefix)
                return interaction.reply("settings Update!")
            }
            if (blacklist) {
                await dbb.push('blacklist', blacklist)
                return interaction.reply("Adding to database!")
            }
            if (nac) {
                if (client.commands.get(nac) === undefined) return interaction.reply("Commands Not found");
                interaction.reply({ content: `Confirm disable command ` + nac, components: [invite] });
                const filter = i => i.user.id === client.config.bot.owner;
                const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1 });
                collector.on('collect', async i => {
                    if (i.customId === 'gsetyes') {
                        await i.deferReply();
                        await wait(4000);
                        await i.editReply({ content: `Mematikan command ` + nac + "...", components: [] })
                        client.commands.delete(nac)
                    }
                    if (i.customId === 'gsetno') {
                        await i.update({ content: "canceled", embeds: [], components: [] })
                    }
                });
            }
        }
    }
}


exports.help = {
    name: "gset",
    description: "Checkmate the `ms`",
    usage: "[prefix]gset [module] [args]",
    example: "d!gset prefix +"
}

exports.conf = {
    aliases: ["globalset"],
    cooldown: 5,
    developer: true,
    permissions: [""],
    needperms: [""],
}