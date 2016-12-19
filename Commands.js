/**
 * Created by McMacker4 on 18/12/2016.
 * Modified by MagicInventor (http://magicinventor.xyz) on 19/12/2016
 */

const commands = {
    list: {
        "!temp": {
            info: "Borra 500 mensajes.",
            roles: ["Adminsitrador"],
            exec: (message) => {
                message.delete(5000);
            }
        },
        "!info": {
            info: "Muestra el link de github del bot.",
            roles: ["@everyone"],
            exec: (message) => {
                message.reply("Ayudame a mejorar: https://github.com/darkaqua/darkbot");
            }
        },
        "!help": {
            info: "Es el comando que estas usando ahora.",
            roles: ["@everyone"],
            exec: (message) => {

                var full_help = "";
                for (var key in commands.list) {
                    full_help += key + " - " + commands.list[key].info + "\n";
                }

                message.channel.sendMessage(full_help);
            }
        }
    },
    hasPermission: (command, member) => {
        for (let i = 0; i < command.roles.length; i++) {
            let role = command.roles[i];
            if (member.roles.findKey("name", role)) {
                return true;
            }
        }
        return false;
    }
};

module.exports = commands;