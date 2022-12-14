var HTTPserver = {}
var express = require('express');
var glob = require('glob');
var fs = require('fs');
var next = require('next');
var Swagger = require('./swagger');
var bodyParser = require('body-parser');
var { resolve, join, sep } = require('path')
var path = require('path')
var miragePath = path.dirname(require.main.filename);
var Logger = require('./logger');
var { parse } = require('url')
var { createServer } = require('http')
var cors = require('cors');
var viewServerApp = next({});
const handle = viewServerApp.getRequestHandler()
var { signature, verify } = require('./security');
//******************************************************************************************************************
let app = express();
let port = process.env.ServerPort;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: process.env.ServerFilelimit }));
app.use(bodyParser.urlencoded({ limit: process.env.ServerFilelimit, extended: true }));
let Server = createServer(app);
Server.listen(port, () => { console.log(`server is online , port ${port}`); });
//******************************************************************************************************************
let routerMaker = () => {
    try {
        const Router = express.Router;
        return (
            glob
                .sync('**/*.js', { cwd: `${__dirname}/routes/` })
                .map(filename => require(`./routes/${filename}`))
                .filter(router => router ? Object.getPrototypeOf(router) == Router : '')
                .reduce((rootRouter, router) => rootRouter.use(router), Router({ mergeParams: true }))
        )
    } catch (error) { console.log(error); Logger.log('error', error, 'error', false, false, null); }
}
//******************************************************************************************************************
HTTPserver.start = () => {
    return new Promise((resolve, reject) => {
        try {
            app.use(process.env.SwaggerApi, Swagger.serve, Swagger.ui) 
            //******************************************************************************************************
            const router = routerMaker();
            //******************************************************************************************************
            viewServerApp.prepare().then(() => {
                app.use(process.env.ViewApiBasicPath, (req, res, next) => {
                    const parsedUrl = parse(req.url, true)
                    const { pathname, query } = parsedUrl
                    handle(req, res, parsedUrl)
                })
            })
            //******************************************************************************************************
            if (process.env.AuthenticationBasePaths && process.env.AuthenticationBasePaths.length) {
                let AuthenticationBasePaths = (process.env.AuthenticationBasePaths).split(',')
                for (let index = 0; index < AuthenticationBasePaths.length; index++) {
                    const uri = AuthenticationBasePaths[index];
                    app.use(uri, (req, res, next) => {
                        if (req.headers.accessToken && req.headers.accessToken != undefined && req.headers.accessToken != 'undefined' && req.headers.accessToken != 'null') {
                            verify(req.headers.accessToken, null, null, null)
                                .then((result) => {
                                    if (result.state) {
                                        res.locals.client = result.entity;
                                        res.set('accessToken',  req.headers.accessToken);
                                        res.set('refreshToken', req.headers.refreshToken);
                                        res.set('Access-Control-Expose-Headers', 'accessToken');
                                        res.set('Access-Control-Expose-Headers', 'refreshToken');
                                        next();
                                    }
                                    else {
                                        res.set('Access-Control-Expose-Headers', undefined);
                                        res.set('Access-Control-Expose-Headers', undefined); 
                                        res.set('Access-Control-Expose-Headers', 'authorization');
                                        res.send({ state: false, message: result.message, needLogin: true }).status(204)
                                    }
                                }).catch((error) => { 
                                    res.send({ state: false, message: 'verify has error ' }).status(201)
                                })
                        } else { res.send({ state: false, message: 'token not found' }).status(204) }
                    });
                }
            }
            //****************************************************************************************************** 
            app.get('/_next/:path*', async (req, res, params) => {
                let myPath1 = (req.url)
                let myPath2 = (myPath1).replace('_', '.');
                res.sendFile(miragePath + myPath2);
            })
            app.get('/public/:path*', async (req, res, params) => {
                let myPath1 = (req.url)
                let myPath2 = (myPath1).replace('_', '.');
                res.sendFile(miragePath + myPath2);
            })
            //******************************************************************************************************
            app.use(router);
            setTimeout(() => { resolve(true) }, 3000);
        } catch (error) { console.log(error); resolve(false) }
    })
}
//******************************************************************************************************
module.exports = HTTPserver;