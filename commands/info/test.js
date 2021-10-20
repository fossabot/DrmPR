exports.run = async(client, message, args) => {
    embed.standar.addField("Hello")
    message.channel.send({ embeds: [embed.standar] })
}

exports.help = {
    name: "test",
    description: "Checkmate the `ms`",
    usage: "ping",
    example: "ping"
}

exports.slash = false

exports.conf = {
    aliases: ["test"],
    cooldown: 5,
    developer: false,
    permissions: [""],
    needperms: [""],
}