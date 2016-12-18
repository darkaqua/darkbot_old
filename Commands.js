/**
 * Created by McMacker4 on 18/12/2016.
 */

const commands = new Map();

commands.set("!temp", (message) => {
    message.delete(10000)
});

module.exports = commands;