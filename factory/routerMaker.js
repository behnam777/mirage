
var fs = require('fs');
var {idMaker,hashCode} =  require('./security');
//*******************************************************************************************
let routerMaker = (filename)=>{
    if(filename){
        let entity = ((filename).split('/'))[0];  
        let routerProps = require(process.env.SourcePath+filename);  
        if(routerProps && Object.keys(routerProps).length ){
            routerProps = routerProps.Routers;  
            for (let index = 0; index < routerProps.length; index++) {
                let routerInfo = routerProps[index];
                let router  = 'const express = require("express");\n'
                    router += 'const router = express.Router();\n'
                    router += "router."+routerInfo["method"]+"('"+routerInfo["url"]+"',(req, res) => { \n"
                    router += ' try{\n'
                    router += '     (global.Functions["'+entity+'"].'+(routerInfo["service"])  + '(';
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
            } 
        }
    }
    
}
//*******************************************************************************************
module.exports = routerMaker;  