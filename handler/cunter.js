const fs = require('fs'); // fs is the built-in Node.js file system module.
const guilds = require('../database/msend.json'); // This path may vary.
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://intidev:min2kota@cluster0.la9xn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const config = require("../config/configs.json")
module.exports = async(client) => {
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