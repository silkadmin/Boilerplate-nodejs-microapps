/*
 * Main Server, this is the starting point of full system
 * 
 * @author : Bismay <bismay@smartinfologiks.com>
 * */
const packageConfig = require('./package.json');

require("dotenv").config();

global._ENV = {SERVICES:[], HELPERS: []};

global.nanoID = require("nanoid");
global._ = require("lodash");
global.fs = require("fs");
global.path = require("path");
global.axios = require("axios");
global.moment = require("moment");

// const bunyan = require('bunyan');
// const RotatingFileStream = require('bunyan-rotating-file-stream');

fs.readdirSync('./helpers/').forEach(function(file) {
    if ((file.indexOf(".js") > 0 && (file.indexOf(".js") + 3 == file.length))) {
        var filePath = path.resolve('./helpers/' + file);
        var clsName = file.replace('.js','').toUpperCase();

        _ENV.HELPERS.push(clsName);
        global[clsName] = require(filePath);
    }
});

async function main() {
    switch(process.env.CONFIG_TYPE) {
        case "LOCAL":
            global._CONFIG = require(process.env.CONFIG_FILE);
            break;
        case "REMOTE":
            try {
                var tempData = await axios.get(process.env.CONFIG_FILE);
                global._CONFIG = tempData.data;
            } catch(e) {
                console.error("\n\nConfig File Not Found, Shuting Down Server @ "+moment().format(), e.message);
                process.exit(0);
            }
            break;
        default:
            console.info("\n\nConfig Type Not Supported, Skipping the loading of Config");
    }

    switch(process.env.RUN_MODE.toUpperCase()) {
        case "SERVER":
            SERVER.start();
        break;
        case "PLUGIN":
        case "SERVICE":
            PLUGIN.start();
        break;
        default:
            console.error("\n\nRUN_MODE Not Supported, Shuting Down Server @ "+moment().format());
            process.exit(0);
    }
}

//starting the main service
main();
