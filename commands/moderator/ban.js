const Discord = require("discord.js")
const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const danger = new Discord.MessageEmbed()
    .setFooter(`BAN Commands`)
    .setTimestamp()
    .setColor('RED')
    .setImage("https://cdn.discordapp.com/attachments/898596537054142474/899984201833672744/thor-strike.gif")
    .setDescription("**Ban this Memeber?**")
const com = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel('YES')
        .setCustomId('banyes')
        .setStyle('DANGER')
    )
    .addComponents(
        new MessageButton()
        .setLabel('NO')
        .setCustomId('banno')
        .setStyle('SUCCESS')
    )

exports.run = async(client, message, args) => {
    const members = message.author;
    if (message.mentions.users.first() === undefined) return message.reply("You didn't mention the user to ban!")
    const user = message.mentions.users.first().id;
    const reason = args.slice(1).join(" ") || "No reason"
        // If we have a user mentioned
    const success = new Discord.MessageEmbed()
        .setFooter(`Successfully banned`)
        .setTimestamp()
        .setColor('GREEN')
        .setDescription(`**Successfully banned** <@${user}>`)
    const dm = new Discord.MessageEmbed()
        .setFooter(message.guild.name)
        .setTimestamp()
        .setColor('GREEN')
        .setDescription(`You get banned in server **${message.guild.name}** because \`${reason}\` `)

    if (user) {
        // Now we get the member from the user
        const member = message.guild.members.cache.get(user);
        // If the member is in the guild
        if (member) {
            message.channel.send({ content: `Confirm banned`, embeds: [danger], components: [com] });
            const filter = i => i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });
            collector.on('collect', async i => {
                if (i.customId === 'banyes') {
                    member
                        .ban({
                            reason: reason,
                        })
                        .then(() => {
                            member.send({ embeds: [dm] })
                            i.update({ embeds: [success], components: [] })

                        })
                        .catch(err => {
                            i.reply('I was unable to ban the member');
                        });
                }
                if (i.customId === 'banno') {
                    await i.update({ content: "canceled", embeds: [], components: [] })
                }
            })
        } else {
            // The mentioned user isn't in this guild
            i.reply("That user isn't in this guild!");
        }
    } else {
        message.reply("You didn't mention the user to ban!");
    }
}

exports.slash = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban member')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Select a user')
            .setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason ban')),
    async execute(interaction, client, args) {

        const members = interaction.options.getMember('target').id
        const member = interaction.guild.members.cache.get(members);
        interaction.reply({ content: `Confirm banned`, embeds: [danger], components: [com] });
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1 });
        const reason = interaction.options.getString('input') || "No reason"
        const success = new Discord.MessageEmbed()
            .setFooter(`Successfully banned`)
            .setTimestamp()
            .setColor('GREEN')
            .setDescription(`**Successfully banned** ${member}`)
        const dm = new Discord.MessageEmbed()
            .setFooter(interaction.guild.name)
            .setTimestamp()
            .setColor('GREEN')
            .setDescription(`You get banned in server **${interaction.guild.name}** because \`${reason}\` `)
        collector.on('collect', async i => {
            if (i.customId === 'banyes') {
                member
                    .ban({
                        reason: reason,
                    })
                    .then(() => {
                        member.send({ embeds: [dm] })
                        i.update({ embeds: [success], components: [] })

                    })
                    .catch(err => {
                        i.reply('I was unable to ban the member');
                    });
            }
            if (i.customId === 'banno') {
                await i.update({ content: "canceled", embeds: [], components: [] })
            }
        })
    }
}

exports.conf = {
    aliases: [],
    developer: false,
    permissions: ["BAN_MEMBERS"],
    needperms: ["BAN_MEMBERS"],
    cooldown: 4,
};

exports.help = { //lets load commands 
    name: 'ban', //commands name
    description: 'BAN USER :)', //commands discription
    usage: 'ban <user> <reason>' //how they work
}