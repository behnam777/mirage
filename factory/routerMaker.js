
var fs = require('fs');
var { idMaker, hashCode } = require('./security');
//*******************************************************************************************
let routerMaker = async (entityName, Router) => { 
     if (entityName && Router ) {
        let routerInfo = Router;

        //if (routerInfo['method'] == 'render' || !(global.Functions[entityName][routerInfo["service"]])) {
        if (routerInfo['method'] == 'render' || !([routerInfo["service"]])) {
            return false;
            /* render means is view react-next file. NextJS will makes router for it's files automatically */
        }
        let router = 'const express = require("express");\n'
        router += 'const router = express.Router();\n'
        router += "router." + routerInfo["method"] + "('" + routerInfo["url"] + "',(req, res) => { \n"
        router += ' try{\n'
        if (routerInfo.authorization && routerInfo.authorization.length) {
            router += 'if( !(     res.locals.client && res.locals.client.authorizations && (([' +
                [...routerInfo.authorization]
                + ']).some(r=> res.locals.client.authorizations.includes(String(r))))    )){\n'
            router += 'res.status(203).send({status:203,state:false,message:"  Inaccessibility  "})  \n'
            router += 'return false;}\n'
        }
        if (routerInfo.body && routerInfo.body.data && Object.keys(routerInfo.body.data).length) {
            router += 'if( !( 1 '
            for (let index = 0; index < Object.keys(routerInfo.body.data).length; index++) {
                const key = Object.keys(routerInfo.body.data)[index];
                router += ' && '
                router += ' req.body["' + key + '"]'
            }
            router += '   )){\n'
            router += 'res.status(203).send({status:422 ,state:false,message:"  bad body data , Maybe some data is missing  "})  \n'
            router += 'return false;}\n'
        }
        router += '  (global.Functions["' + entityName + '"].' + (routerInfo["service"]) + '(';
        router += '  req.body  , '
        router += '  res.locals.client , '
        router += '  req.query , '
        router += '  req.param , '
        router += '  req.header  '
        router += ') )\n'
        router += '     .then(\n'
        router += '         function(response) { \n'
        router += '             if(response && response.signatures && response.signatures.length){ \n'
        router += '                     res.set("authorization", response.signatures);\n'
        router += '                     res.set("Access-Control-Expose-Headers", "authorization");\n'
        router += '             }\n'
        router += '             else{   res.set("authorization", req.headers.signatures);\n'
        router += '                     res.set("Access-Control-Expose-Headers", "authorization");\n'
        router += '             }\n'
        router += '             res.status(response.status||200).send(response)  \n'
        router += '         },\n'
        router += '         function(error) {console.log(error); res.status(500).send({status:500,state:false,message:"function internal error"})}\n'
        router += '      );\n'
        router += ' }catch(err){console.log(err); res.status(500).send({status:500,state:false,message:"router internal error"}) }\n'
        router += '\n  })\n'
        router += 'module.exports = router;\n'
        await fs.writeFile(__dirname + "/routes/" + idMaker(true) + ".js", router,()=>{});
        global.Routers[entityName] = routerInfo;
        return true;
    }
}
//*******************************************************************************************
module.exports = routerMaker;  