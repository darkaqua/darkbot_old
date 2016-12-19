/**
 * Created by MagicInventor (http://magicinventor.xyz) on 19/12/2016.
 * Este es el estilo cli que yo cree y uso para mis bots, ahí lo tienen!
 * PS: Los colores se ven en también Windows 10, al igual que en linux.
 */

const colours = {
    info: (log_text) => {
        console.log("\033[0;30m| \033[0;33mINFO \033[0;30m|\033[0;34m " + log_text);
    },
    fail: (log_text) => {
        console.log("\033[0;30m| \033[0;31mFAIL \033[0;30m|\033[0;34m " + log_text);
    },
    error: (log_text) => {
        console.log("\033[0;30m| \033[0;31m" + log_text + " \033[0;30m|");
    },
    chat: (nick, message) => {
        console.log("\033[0;32m" + nick + "\033[0;30m: \033[0;34m" + message);
    },
};

module.exports = colours;