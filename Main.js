/**
 * Created by Pablo on 17/12/2016.
 */
"use strict";

//region Constantes
const fs = require('fs');
const http = require('http');
const https = require('https');
const Discord = require('discord.js');
const child_process = require("child_process");
const createHandler = require('github-webhook-handler');

let config = { token: "", handlerHash: "" };
try{
    config = JSON.parse(fs.readFileSync("../config.json"));
} catch(e) {}
const handler = createHandler({ path: '/webhook', secret: config.handlerHash });

const e = {
    travis_launch: (process.argv[2] === "TEST"),

    port: process.argv[2] ? process.argv[2] : 7777,
    currentVersion: process.argv[3],
    lastVersion: process.argv[4],

    bot: new Discord.Client(),
    config: config
};

const getChannel = (channel_name) => {
    return e.bot.channels.find("name", channel_name);
};

const Logger = require("./Logger");
const logger = new Logger("out.log");

//endregion

if(!e.port || !e.currentVersion) {
    console.log("Usage: node Main.js port version [last_version]");
    process.exit();
}

http.createServer((req, res) => {
    handler(req, res, (err) => {
        res.statusCode = 202;
        res.end('no such location');
    });
}).listen(e.port);

handler.on("error", (err) => {
    logger.error('Error:', err.message)
});

handler.on("release", (event) => {
    const newVersion = event.payload.release["tag_name"];

    e.bot.user.setGame(`actualizando a ${newVersion}...`)
        .then()
        .catch(logger.error);
    e.bot.user.setStatus("idle")
        .then()
        .catch(logger.error);

    //Clone from github
    child_process.execSync(`git clone https://github.com/darkaqua/darkbot ${__dirname}/../${newVersion}`);
    process.chdir(`../${newVersion}`);
    //Install dependencies
    try {
        child_process.execSync("npm install");
    } catch (ignored) {}
    logger.message("Installed dependencies (npm).");
    //stdio files (log files)
    const outs = fs.openSync("start.log", "a");
    const errs = fs.openSync("start.log", "a");
    //Spawn the process
    const newPort = (e.port === 7777) ? 7778 : 7777;
    child_process.spawn("node", ["Main.js", newPort, newVersion, e.currentVersion], { detached: true, stdio: ["ignore", outs, errs] });
    logger.message("New version spawned.");
    process.exit();
});

//Delete last version when this one is already running.
e.bot.on('ready', () => {
  if(e.lastVersion) {
      try {
          child_process.execSync(`rm -rf ../${e.lastVersion}`);
          logger.message("Last version deleted correctly.")
      } catch(e) {
          logger.error(`Error deleting last version: ${e}`)
      }
      //Envía un embed a #darkbot_project con la info de la actualización.
      //(Cualquier parecido con el código de @McMacker4 es mera coincidencia)
      let options = {
          hostname: "api.github.com",
          path: `/repos/darkaqua/darkbot/releases/tags/${e.currentVersion}`,
          headers: { "User-Agent": "darkaqua-darkbot" }
      };
      let req = https.request(options, (res) => {
          let data = "";
          res.on("data", chunk => { data += chunk; });
          res.on("end", () => {
              if(res.statusCode !== 404) {
                  let release = JSON.parse(data);
                  let embed = new Discord.RichEmbed({ timestamp: release["created_at"] });
                  embed.setTitle(`v${e.currentVersion}`)
                      .setURL(release["html_url"])
                      .addField((release["name"] ? release["name"] : `v${e.currentVersion}`), (release["body"] ? release["body"] : "No description provided."))
                      .setColor("#2691b3")
                      .setFooter(release["prerelease"] ? "pre-realease" : "release");
                      getChannel('darkbot_project').sendMessage("***Actualizado***");
                  getChannel('darkbot_project').sendEmbed(embed);
              }
          });
      });
      req.on("error", (err) => { logger.error('Request Error:' + err.message) });
      req.end();
  }
});

//Llamada a los eventos del bot
require('./BotEvents')(e);
