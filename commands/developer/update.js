let { execSync } = require('child_process')
exports.run = async(client, message, args) => {
    let stdout = execSync('git remote set-url origin https://github.com/Nurutomo/wabot-aq.git && git pull')
    client.reload()
    message.channel.send("```" + stdout.toString() + "```")
}

exports.help = {
    name: "update",
    description: "Update file bot",
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