let { execSync } = require('child_process')
const { MessageActionRow, MessageButton } = require('discord.js')
const Discord = require('discord.js')
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
const standar = new Discord.MessageEmbed()
    .setFooter("DotBot")
    .setColor("YELLOW")
    .setDescription("**Confirm Update**")
    .setTimestamp()
const already = new Discord.MessageEmbed()
    .setFooter("DotBot")
    .setColor("GREEN")
    .setDescription("**Already up to date**")
    .setTimestamp()
exports.run = async(client, message, args) => {
    message.channel.send("Checking Update...")
    message.channel.send({ embeds: [standar], components: [invite] });
    const filter = i => i.user.id === client.config.bot.owner;
    const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });
    collector.on('collect', async i => {
        if (i.customId === 'offyes') {
            let stdouts = execSync('git remote set-url origin https://github.com/DemuraAIdev/DrmPR.git && git pull')
            let stdout = stdouts.toString()
            const update = new Discord.MessageEmbed()
                .setFooter("DotBot")
                .setColor("GREEN")
                .setDescription("Update complete\n```" + stdout + "```")
                .setTimestamp()
            if (stdout === "Already up to date.") {
                await i.update({ embeds: [already], components: [] })
                client.reload()
            } else {
                await i.update({ embeds: [update], components: [] })
            }

        }
        if (i.customId === 'offno') {
            await i.update({ content: "canceled", embeds: [], components: [] })
        }
    });
}

exports.help = {
    name: "update",
    description: "Update file bot & reload",
    usage: "[prefix]update",
    example: "[prefix]update"
}

exports.slash = false

exports.conf = {
    aliases: ["kill"],
    developer: true,
    permissions: [""],
    needperms: [""],
}