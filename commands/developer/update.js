let { execSync } = require('child_process')
const { MessageActionRow, MessageButton } = require('discord.js')
const Discord = require('discord.js')
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
        if (i.customId === 'yes') {
            let stdout = execSync('git remote set-url origin https://github.com/DemuraAIdev/DrmPR.git && git pull')
            const update = new Discord.MessageEmbed()
                .setFooter("DotBot")
                .setColor("GREEN")
                .setDescription("Update complete\n```" + stdout.toString() + "```")
                .setTimestamp()
            if (stdout.toString() === "Already up to date.") {
                await i.update({ embeds: [already], components: [] })
                client.reload()
            } else {
                await i.update({ embeds: [update], components: [] })
            }

        }
        if (i.customId === 'no') {
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