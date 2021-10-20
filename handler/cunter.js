const fs = require('fs'); // fs is the built-in Node.js file system module.

const config = require("../config/configs.json")
const path = "./database/msend.json"
const path2 = "./database/blacklist.json"
module.exports = async(client) => {
    if (!fs.existsSync(path)) {
        fs.appendFile('database/msend.json', '{}', function(err) {
            if (err) throw err;
            console.log('Saved!');
            process.exit()
        });
    }
    if (!fs.existsSync(path2)) {
        fs.appendFile('database/blacklist.json', '{"blacklist": []}', function(err) {
            if (err) throw err;
            console.log('Saved!');
            process.exit()
        });
    }
    const guilds = require('../database/msend.json'); // This path may vary.
    client.on('message', message => {
        // If the author is NOT a bot...
        if (!message.author.bot) {
            // If the guild isn't in the JSON file yet, set it up.
            if (!guilds[message.guild.id]) guilds[message.guild.id] = { messageCount: 1 };
            // Otherwise, add one to the guild's message count.
            else guilds[message.guild.id].messageCount++;

            // Write the data back to the JSON file, logging any errors to the console.
            try {
                fs.writeFileSync('./database/msend.json', JSON.stringify(guilds)); // Again, path may vary.
            } catch (err) {
                console.error(err);
            }
        }

    });
}