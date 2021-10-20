const config = require("../config/configs.json")
let jsoning = require("jsoning");
let db = new jsoning("database/global.json");
module.exports = async(client) => {
    console.log(`${client.user.username} is now ready to be online.`)
    let globalprefix = await db.get("prefix")
    let prefix = globalprefix || client.config.bot.prefix;

    function randomStatus() {
        let status = [config.kernel, config["kernel-version"], "My Prefix is " + prefix]
        let rstatus = Math.floor(Math.random() * status.length);

        client.user.setActivity(status[rstatus], { type: "COMPETING" });
    }
    setInterval(randomStatus, 10000);
}