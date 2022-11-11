var timeAndDate = new Object();
var moment = require('moment-timezone'); 
var Logger = require('./logger'); 
//*******************************************************************************************
timeAndDate.getMilliSecondTime = () => { 
        try {
            let m = moment().valueOf();
            return m;
        } catch (error) {Logger.log('error',error,'error',false,false,null);} 
};
//*******************************************************************************************
timeAndDate.TehranTime = () => { 
        try {//tehran ---> 3.5
            var d    = new Date();
            var utc  = d.getTime() + (d.getTimezoneOffset() * 60000);
            var nd   = new Date(utc + (3600000*(3.5))); 
            return  nd.toLocaleString();
        } catch (error) {Logger.log('error',error,'error',false,false,null);} 
};
//*******************************************************************************************
timeAndDate.timeAsName = () => { 
        try {   
            var year  = moment().year();
            var month = parseInt(moment().month()) + 1;
            var day   = moment().date();
            return  (year + '_' + month + '_' + day)
        } catch (error) {Logger.log('error',error,'error',false,false,null);} 
};
//*******************************************************************************************
timeAndDate.getTime = ()=>{   
        try { 
            let date    = new Date();  
            let year    = moment().year();
            let mounth  = parseInt(moment().month()) + 1;
            let day     = moment().date();
            let hour    = moment().hour();
            let minuts  = moment().minute();
            let second  = moment().second();
            let milliSecond = date.getMilliseconds();

            let nowDate = (year+'_'+mounth+'_'+day+' '+hour+'_'+minuts+'_'+second+'_'+milliSecond);
            return(nowDate);
        } catch (error) {   Logger.log('error',error,'error',false,false,null);   } 
}  
//*******************************************************************************************
module.exports = timeAndDate;