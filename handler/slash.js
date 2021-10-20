const config = require("../config/configs.json")
let jsoning = require("jsoning");
let db = new jsoning("database/global.json");
const Discord = require("discord.js")

module.exports = async(client, message) => {
    const prefix = await db.get("prefix")
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        let commandFile = client.commands.get(interaction.commandName)
        if (commandFile.conf.developer === true) {
            if (!client.config.bot.owner.includes(interaction.user.id)) return interaction.reply('You are not my **Developer**!');
        }
        if (!interaction.member.permissions.has(commandFile.conf.permissions)) return interaction.reply(`Not Enough Permission!\n**Require: ${commandFile.conf.permissions} **`);
        if (!commandFile) return;
        let args = false;

        function runs(commands) {
            client.commands.get(commands).run(client, message, args, interaction);
        }
        try {
            await commandFile.slash.execute(interaction, client, runs);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while executing this command! send report type \`${prefix}report <Reason>\``, ephemeral: true });
        }
    });
}