const { Collection, Client, MessageActionRow, MessageButton } = require("discord.js"),
    Discord = require("discord.js"),
    fs = require("fs");
let jsoning = require("jsoning");
module.exports = class system extends Client {
    constructor(options) {
        super(options)
        this.connections = new Map();
        this.CommandsRan = 0;
        this.client = this;
        this.warna = require('../config/color.json');
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.config = require('../config/configs.json');
        this.recent = new Set();
        this.db = new jsoning("database/global.json");
    }
    reload() {
        fs.readdir("./commands/", (err, categories) => {
            if (err) console.log(err); // it will send you an error, if there was something went wrong.
            console.log(`Found total ${categories.length} categories.`);
            categories.forEach(category => {
                let moduleConf = require(`../commands/${category}/module.json`);
                moduleConf.path = `./commands/${category}`;
                moduleConf.cmds = [];
                if (!moduleConf) return;
                this.client.helps.set(category, moduleConf);
                fs.readdir(`./commands/${category}`, (err, files) => {
                    console.log(
                        `Found total ${files.length - 1} command(s) from ${category}.`
                    );
                    if (err) console.log(err);
                    let commands = new Array();

                    files.forEach(file => {
                        if (!file.endsWith(".js")) return;
                        let prop = require(`../commands/${category}/${file}`);
                        let cmdName = file.split(".")[0];

                        this.client.commands.set(prop.help.name, prop);

                        prop.conf.aliases.forEach(alias => {
                            this.client.aliases.set(alias, prop.help.name);
                        });

                        this.client.helps.get(category).cmds.push(prop.help.name);

                    });
                });

            })
        })
        return "Success reload()"
    }

}