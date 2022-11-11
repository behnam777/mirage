var HTTP = new Object(); 
var express = require('express');
var Glob = require('glob');
var fs = require('fs');
var Logger = require('./logger');
//var Swagger = require('./swagger');
var bodyParser =  require('body-parser');
var thehttp = require('http')
var cors =  require('cors');  
var {sign} =  require('./security'); 
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
            HTTP.app.use(bodyParser.json({limit: '50mb'}));
            HTTP.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
            HTTP.Server = thehttp.createServer(HTTP.app)
            HTTP.Server.listen(HTTP.port,()=>{console.log(`server is online , port ${HTTP.port}`);});  
            //****************************************************************************************************** 
            //HTTP.app.use(global.DataBase.swagger['swaggerApi'],Swagger.serve,Swagger.ui) 
            //******************************************************************************************************
            const router    = HTTP.routerMaker();   
            //******************************************************************************************************
            HTTP.app.use('/api/',(req,res,next)=>{  
                if(req.headers.authorization && req.headers.authorization != undefined && req.headers.authorization != 'undefined' && req.headers.authorization != 'null'){ 
                    sign(req.headers.authorization,null,null,null)
                    .then((verify)=>{  
                        if(verify.state){ 
                            res.locals.client  = verify.client;
                            res.set('authorization', req.headers.authorization);
                            res.set('Access-Control-Expose-Headers', 'authorization'); 
                            next(); 
                        }
                        else{
                            res.set('authorization', undefined);
                            res.set('Access-Control-Expose-Headers', 'authorization');
                            res.send({state:false, message:'invalid token',needLogin:true}).status(200)
                        }
                    }).catch((error)=>{
                        res.set('authorization', req.body,req.headers.authorization);
                        res.set('Access-Control-Expose-Headers', 'authorization');  
                        res.send({state:false,message:'verify has error '}).status(200) 
                    }) 
                }else{res.send({state:false, message:'token not found'}).status(200)}
            });   
            //******************************************************************************************************
            HTTP.app.use(router); 
            HTTP.app.use(function (req, res, next) {
                res.status(404).send({state:false, message:"Sorry can't find page!"})
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