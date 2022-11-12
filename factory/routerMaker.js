
var fs = require('fs');
var {idMaker,hashCode} =  require('./security');
//*******************************************************************************************
let routerMaker = (entityName , Routers)=>{
    if(entityName && Routers && Routers.length){  
        for (let index = 0; index < Routers.length; index++) {
            let routerInfo = Routers[index];
            let router  = 'const express = require("express");\n'
                router += 'const router = express.Router();\n'
                router += "router."+routerInfo["method"]+"('"+routerInfo["url"]+"',(req, res) => { \n"
                router += ' try{\n'
                router += '     (global.Functions["'+entityName+'"].'+(routerInfo["service"])  + '(';
                router += 'req = req ' +','
                router += 'client =  res.locals.client '  +',' 
                router += ') )\n'
                router += '     .then(\n'
                router += '         function(value) {res.send(value).status(value.status||200) },\n'
                router += '         function(error) {res.send({status:false,message:"function internal error"}).status(value.status||500)}\n'
                router += '      );\n'  
                router += ' }catch(err){res.send({status:false,message:"router internal error"}).status(500) }\n'
                router += '\n  })\n'  
                router += 'module.exports = router;\n'
            fs.writeFileSync(__dirname+"/routes/"+idMaker(true)+".js", router); 
            global.Routers[entityName] = routerInfo;
        } 
    }
}
//*******************************************************************************************
module.exports = routerMaker;  