const Discord = require('discord.js')
const core = require("./ClientBuilder")
const client = new core({ intents: ["GUILDS", "GUILD_MESSAGES"] });
let bot = client.config.bot;

let globalprefix = client.db.get("prefix")
let prefix = globalprefix || client.config.bot.prefix;

const standar = new Discord.MessageEmbed()
    .setFooter("DotBot")
    .setColor("RANDOM")
    .setTimestamp()


exports.standar = standar