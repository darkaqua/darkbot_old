#!/usr/bin/env node
/**
 * Created by Pablo (http://pagoru.es) on 17/12/2016
 * Modified by MagicInventor (http://magicinventor.xyz) on 19/12/2016
 */

const Discord = require('discord.js');
const commands = require("./Commands");
const colours = require("./Colours");


const bot = new Discord.Client();

const token = process.argv[2];

if(typeof token === 'undefined') {
    colours.fail("Veo que falta el token, se usa así: ./Main.js <token>")
    process.exit();
}


bot.on('ready', () => {
    colours.info("Here we go! ❤");
});

/**a
 * @deprecated Usado para debug
 */
function delete100Messages(){
    const channel = bot.channels.find("name", "bienvenida");
    channel.fetchMessages({limit: 100})
        .then(messages => {
            for (let i = 0; i < messages.array().length; i++) {
                const message = messages.array()[i];
                console.log(message.id + " <- Deleted!");
                message.delete();
            }
        })
        .catch(console.error);
}

bot.on('message', message => {
    // console.log(bot.permissions);//member.roles.findKey("name", "adm")
    colours.chat(message.author.username, message.content);

    if(message.content.startsWith("!")) { // no sé ustedes, pero yo usaría regex

        const command = commands.list[message.content.split(" ")[0]];
        if(command && commands.hasPermission(command, message.member)) {
            command.exec(message);
        }

    } else if(!message.author.bot){
        if(message.mentions.users.findKey("id", bot.user.id) != null){
            message.reply(" lo siento, aún no puedo hacer nada..!");
            message.reply("Ayudame a mejorar con tu aportación... https://github.com/darkaqua/darkbot");
        }
    }
});

//Usuario nuevo en el servidor
bot.on("guildMemberAdd", guildMemberAdd => {
    const channel = bot.channels.find("name", "bienvenida");
    channel.sendMessage(guildMemberAdd + " se ha unido al servidor!");

    colours.info(guildMemberAdd.name + " se ha unido al servidor!");
});

bot.login(token);