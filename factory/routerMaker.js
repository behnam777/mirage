
var fs = require('fs');
var {idMaker,hashCode} =  require('./security');
//*******************************************************************************************
let routerMaker = (entityName , Routers)=>{
    if(entityName && Routers && Routers.length){  
        for (let index = 0; index < Routers.length; index++) {
            let routerInfo = Routers[index];
            if(routerInfo['method'] == 'render'){ break;/* render means is view react-next file. NextJS will makes router for it's files automatically */ }
            let router  = 'const express = require("express");\n'
                router += 'const router = express.Router();\n'
                router += "router."+routerInfo["method"]+"('"+routerInfo["url"]+"',(req, res) => { \n"
                router += ' try{\n'
                router += '     (global.Functions["'+entityName+'"].'+(routerInfo["service"])  + '(';
                router += '  req ' +','
                router += '  res.locals.client '  
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
            fs.writeFileSync(__dirname+"/routes/"+idMaker(true)+".js", router); 
            global.Routers[entityName] = routerInfo;
        } 
    }
}
//*******************************************************************************************
module.exports = routerMaker;  