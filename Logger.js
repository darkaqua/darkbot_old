/**
 * Created by McMacker4 on 23/12/2016.
 * Modified by MagicInventor (http://magicinventor.xyz) on 23/12/2016
 */

const fs = require("fs");

class Logger {

    constructor(filename) {
        this.out = fs.createWriteStream(filename, { flags: 'a' });
    }

    message(msg) {
        this.writelog("[MSG][" + Logger.date() + "] " + msg + "\n");
  
    }

    warning(msg) {
        this.writelog("[WARN][" + Logger.date() + "] " + msg + "\n");
    }

    error(msg) {
        this.writelog("[ERROR][" + Logger.date() + "] " + msg + "\n");
    }

    writelog(tpl) {
        this.out.write(tpl);
        console.log(tpl.replace("\n", ""));

    }
    static date() {
        return new Date().toLocaleString();
    }

}

module.exports = Logger;
