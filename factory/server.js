var HTTP = new Object(); 
var express = require('express');
var Glob = require('glob');
var fs = require('fs');
var Logger = require('./logger');
//var Swagger = require('./swagger');
var bodyParser =  require('body-parser');
var thehttp = require('http')
var cors =  require('cors');  
var {signature,verify} =  require('./security'); 
//******************************************************************************************************************
HTTP.Initializing = ()=>{
    return new Promise((resolve,reject)=>{
        try { 
            HTTP.app  = express();   
            HTTP.port = process.env.ServerPort;
            HTTP.root = '.';
            //******************************************************************************************************
            HTTP.app.use(cors());
            HTTP.app.use(express.json())
            HTTP.app.use(bodyParser.json()); 
            HTTP.app.use(bodyParser.json({limit: process.env.ServerFilelimit}));
            HTTP.app.use(bodyParser.urlencoded({limit: process.env.ServerFilelimit, extended: true}));
            HTTP.Server = thehttp.createServer(HTTP.app)
            HTTP.Server.listen(HTTP.port,()=>{console.log(`server is online , port ${HTTP.port}`);});  
            //****************************************************************************************************** 
            //HTTP.app.use(global.DataBase.swagger['swaggerApi'],Swagger.serve,Swagger.ui) 
            //******************************************************************************************************
            const router    = HTTP.routerMaker();   
            //******************************************************************************************************
            if(process.env.AuthenticationUris && process.env.AuthenticationUris.length){
                for (let index = 0; index < process.env.AuthenticationUris.length; index++) {
                    const uri = process.env.AuthenticationUris[index];
                    HTTP.app.use(uri,(req,res,next)=>{  
                        if(req.headers.authorization && req.headers.authorization != undefined && req.headers.authorization != 'undefined' && req.headers.authorization != 'null'){ 
                            sign(req.headers.authorization,null,null,null)
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
            HTTP.app.use(router); 
            HTTP.app.use(function (req, res, next) {
                res.send({state:false, message:"Sorry can't find page!"}).status(404)
            })     
            //******************************************************************************************************
            resolve(true);
        } catch (error) {       reject(error);  }
    })
} 
//******************************************************************************************************************
HTTP.routerMaker = ()=>{
    try {
        const glob   = Glob ;
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
//******************************************************************************************************************************************************************************
module.exports = HTTP;