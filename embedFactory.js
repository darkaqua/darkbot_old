exports.createEmbed = function(message) {
    let embed = {
        "description": message.content,
        "color": message.member.highestRole.color,
        "timestamp": message.createdAt.toISOString(),
        "author": {
            "name": message.author.username,
            "icon_url": message.author.displayAvatarURL
        },
        "footer": {
            "text": "#" + message.channel.name
        }
    };
    let img = (() => {
        let att;
        message.attachments.forEach((val) => {
            if(val.width && !att) {
                att = val;
            }
        });
        return att;
    })();
    if(img) {
        embed["image"] = {};
        embed["image"]["url"] = img.url;
    }
    return embed;
}
