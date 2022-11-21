var fs = require('fs');
var util = require('util');
var timeAndDate = require('./timeAndDate.js');
var deleteFolder = require('./deleteFolder');
var path = require('path');
var logsPath = path.dirname(require.main.filename) + '/factory/logs/';
//*******************************************************************************************
var log = {};
log.Setting = { txt1: "   ", txt2: "   ", txt3: "   ", txt4: "   ", txt5: "   ", txt6: "   ", field1: "type", field2: "filename", field3: "date", field4: "message", field5: "millisecond", phoneNumber: "", backupTimeLogs: 6, dailyLogsList: [], cloudStorage: false }
//*******************************************************************************************
log.console = (type, message, needSaveAsLog) => {
    try {
        switch (type) {
            case 'error': console.log('\x1b[31m', message, '\x1b[0m'); break;//Red
            case 'log': console.log('\x1b[32m', message, '\x1b[0m'); break;//Green
            case 'warning': console.log('\x1b[33m', message, '\x1b[0m'); break;//Yellow
            case 'important': console.log('\x1b[33m', "\x1b[44m", message, '\x1b[0m', "\x1b[40m"); break;//Blue 
            case 'notImportant': console.log('\x1b[36m', message, '\x1b[0m'); break;//Gray  
            default: console.log(type); break;//white
        }
        if (needSaveAsLog === true) { log.log('consoleLogs', message, type) }
    } catch (error) { return false; }
}
//*******************************************************************************************
log.loggerSettings = (data) => {
    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < Object.keys(data).length; i++) {
                let property = Object.keys(data)[i];
                if ((log.Setting).hasOwnProperty(property)) {
                    log.Setting[property] = data[property];
                }
            }
            resolve({ state: true, message: 'Settings were successfully applied' });

        } catch (error) { resolve({ state: false, message: 'internal error' }); }
    })
}
//*******************************************************************************************
log.log = (filename, receivedMessage, type = 'log', needJson, sentToAdmin, sendToFamily, needSMS) => {
    try {
        //return true;
        //******* 1 - Check 'receivedMessage' Format  *** 
        if (typeof receivedMessage === 'object') {
            try {
                receivedMessage = JSON.stringify(receivedMessage, Object.getOwnPropertyNames(receivedMessage))
            } catch (error) { return false; }
        }
        //******* 2 - make information for logging    *** 
        let logMessage = {}
        logMessage.filename = filename;
        logMessage.date = (timeAndDate).getTime();
        logMessage.millisecond = (timeAndDate).getMilliSecondTime();
        logMessage.type = (type);
        logMessage.message = (receivedMessage);
        logMessage.notSelected = ' ';
        //******* 3 - Make Folder For Save Logs *** 

        let dateForFolderName = (timeAndDate).timeAsName();
        let dailyDirectiory = logsPath + dateForFolderName;
        let logTypeDirectiory = logsPath + dateForFolderName + '/' + type;
        let saveMessage = util.inspect(logMessage);
        //******* 4 - Now we form the desired format on Message  ***   
        saveMessage = ((log.Setting).txt1 + logMessage[(log.Setting).field1] + (log.Setting).txt2 + logMessage[(log.Setting).field2] + (log.Setting).txt3 + logMessage[(log.Setting).field3] +
            (log.Setting).txt4 + logMessage[(log.Setting).field4] + (log.Setting).txt5 + logMessage[(log.Setting).field5] + (log.Setting).txt6 + '\n')
        //******* 5 - Make Directory for save logs ***  
        if (!fs.existsSync(dailyDirectiory)) {
            try { fs.mkdirSync(dailyDirectiory); } catch (error) { return false; }
            setTimeout(() => {
                if ((log.Setting.dailyLogsList.length) > (parseInt(log.Setting.backupTimeLogs) - 1)) {
                    let mustDelete = ''
                    try { mustDelete = (log.Setting.dailyLogsList).shift(); } catch (error) { return false; }
                    try { if (mustDelete && fs.existsSync(mustDelete)) { deleteFolder.delete(mustDelete); } } catch (error) { return false; }
                }
                if ((log.Setting.dailyLogsList.length) < (parseInt(log.Setting.backupTimeLogs))) {
                    log.Setting.dailyLogsList.push(dailyDirectiory);
                }
                if (!fs.existsSync(logTypeDirectiory)) { setTimeout(() => { try { fs.mkdirSync(logTypeDirectiory); } catch (error) { return false; } }, 10) }
            }, 10)
        } else { if (!fs.existsSync(logTypeDirectiory)) { setTimeout(() => { try { fs.mkdirSync(logTypeDirectiory); } catch (error) { return false; } }, 10) } }
        //******* 6 - now , we have directories and formated logs , so Save Log Files *** 
        try {
            fs.appendFile(logTypeDirectiory + '/' + filename + '.log', saveMessage, () => {
                fs.appendFile(dailyDirectiory + '/' + 'general' + '.log', saveMessage, () => { });
            })
        } catch (error) { return false; }

        //******* 7 - If call LOG function and need Json format by set 'needJson' parametr 'True' *** 
        if (needJson) {
            try { fs.appendFile(logTypeDirectiory + '/' + filename, ',' + (JSON.stringify(logMessage)), () => { }); } catch (error) { return false; }

        }
        //******* 8 - update generaljs   ***
        try { fs.appendFile(dailyDirectiory + '/' + 'general', ',' + (JSON.stringify(logMessage)), () => { }); } catch (error) { return false; }

        return true;
    }
    catch (error) { return false; }
}
//*******************************************************************************************
log.Monitor = (callback) => {
    return new Promise((resolve, reject) => {
        try {

            log.LogsFolders = [];
            let logText = '';
            fs.readdirSync('./logs').filter(function (folder) {
                if (fs.statSync('./logs' + '/' + folder).isDirectory()) {
                    try {
                        logText = (fs.readFileSync('./logs' + '/' + folder + '/' + 'general', "utf8"));
                        //logText =  logText 
                        logText = logText.substring(1);
                        logText = '[' + logText + ']'
                        log.LogsFolders.push([folder, logText]);
                    }
                    catch (error) { }
                }
            });
            setTimeout(() => {
                if (callback && typeof (callback) === 'function') { callback(log.LogsFolders) }
                else { resolve(log.LogsFolders) }
            }, 2000);

        } catch (error) { console.log(error); }
    })

}
//*******************************************************************************************
//console.log('\x1b[32m','... Logger is Initializing','\x1b[0m');
log.start = () => {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(logsPath)) {
                fs.mkdirSync(logsPath);
                resolve(true);
            }
            else { resolve(true);}
        }
        catch (error) { console.log(error); resolve(false); }
    })
}
//*******************************************************************************************
module.exports = log;