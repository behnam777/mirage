var HTTP = new Object(); 
var express = require('express');
var glob = require('glob');
var fs = require('fs');
var Logger = require('./logger');
//var Swagger = require('./swagger');
var bodyParser =  require('body-parser');
var thehttp = require('http')
var cors =  require('cors');  
var {signature,verify} =  require('./security'); 
//******************************************************************************************************************
let routerMaker = ()=>{
    try {
        const Router = express.Router;
        return(
            glob
            .sync('**/*.js', { cwd: `${__dirname}/routes/` })
            .map(filename => require(`./routes/${filename}`))
            .filter(router => router ?  Object.getPrototypeOf(router) == Router :'' )
            .reduce((rootRouter, router) => rootRouter.use(router), Router({ mergeParams: true }))
        )
    } catch (error) {console.log(error);Logger.log('error',error,'error',false,false,null); }
} 
//******************************************************************************************************************
try { 
    let app  = express();   
    let port = process.env.ServerPort; 
    //******************************************************************************************************
    app.use(cors());
    app.use(express.json())
    app.use(bodyParser.json()); 
    app.use(bodyParser.json({limit: process.env.ServerFilelimit}));
    app.use(bodyParser.urlencoded({limit: process.env.ServerFilelimit, extended: true}));
    let Server = thehttp.createServer(app)
        Server.listen(port,()=>{console.log(`server is online , port ${port}`);});  
    //****************************************************************************************************** 
    //app.use(global.DataBase.swagger['swaggerApi'],Swagger.serve,Swagger.ui) 
    //******************************************************************************************************
    const router    = routerMaker();   
    //******************************************************************************************************
    if(process.env.AuthenticationBasePaths && process.env.AuthenticationBasePaths.length){
        let AuthenticationBasePaths = (process.env.AuthenticationBasePaths).split(',')
        for (let index = 0; index < AuthenticationBasePaths.length; index++) {
            const uri = AuthenticationBasePaths[index]; 
            app.use(uri,(req,res,next)=>{  
                if(req.headers.authorization && req.headers.authorization != undefined && req.headers.authorization != 'undefined' && req.headers.authorization != 'null'){ 
                    verify(req.headers.authorization,null,null,null)
                    .then((result)=>{  
                        if(result.state){ 
                            res.locals.client  = result.entity;
                            res.set('authorization', req.headers.authorization);
                            res.set('Access-Control-Expose-Headers', 'authorization'); 
                            next(); 
                        }
                        else{
                            res.set('authorization', undefined);
                            res.set('Access-Control-Expose-Headers', 'authorization');
                            res.send({state:false, message:result.message,needLogin:true}).status(204)
                        }
                    }).catch((error)=>{
                        res.set('authorization', req.body,req.headers.authorization);
                        res.set('Access-Control-Expose-Headers', 'authorization');  
                        res.send({state:false,message:'verify has error '}).status(201) 
                    }) 
                }else{res.send({state:false, message:'token not found'}).status(204)}
            });   
        }
    }
    //******************************************************************************************************
    app.use(router); 
    app.use(function (req, res, next) {
        res.send({state:false, message:"Sorry can't find page!"}).status(404)
    })     
    //******************************************************************************************************
     
} catch (error) {     console.log(error)  } 

 