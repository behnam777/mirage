'use strict';
let Bundler = {}
//************************************************************************** 
var glob = require('glob');
var fs = require('fs');
var { idMaker, hashCode, signature, verify } = require('./security');
var Database = require('./database/Database');
var deleteFolder = require('./deleteFolder');
var routerMaker = require('./routerMaker');
var logger = require('./logger');
var path = require('path');
var absolutePath = path.dirname(require.main.filename);
var src = path.dirname(require.main.filename) + '/src/';
global.duix = require('duix');
let swagger = require('./swagger.js');
//**************************************************************************All Globals
global.Functions = {} //FUNCTIONS 
global.Entities = [] //ENTITIES       
global.Routers = {} //ROUTERS
global.Models = {} //MODELS 
global.idMaker = idMaker;
global.hash = hashCode;
global.signature = signature;
global.verify = verify;
//**************************************************************************Functions
Bundler.start = async () => {
    return new Promise((resolve, reject) => {
        glob
        .sync('**/functions/*.js', { cwd: `${src}` })
        .map(filename => {
            let entity = ((filename).split('/'))[0];
            (global.Entities).push(entity);
            global.Functions[entity] = require(src + filename);
        })
        //**************************************************************************Models
        glob
        .sync('**/models/*.js', { cwd: `${src}` })
        .map(filename => {
            let entityName = '';
            let entityModel = '';
            if (filename) { entityName = ((filename).split('/'))[0]; } 
            if (entityName) { entityModel = require(src + filename); }
            if (entityName && entityModel && entityModel) { Database.modelMaker(entityName, entityModel) }
        })
        //**************************************************************************Routers
        deleteFolder.delete(absolutePath + '/factory/routes',()=>{

            if (!fs.existsSync(__dirname + '/routes')) { fs.mkdirSync(__dirname + '/routes'); }
            if ( fs.existsSync(__dirname + '/swaggerDocuments.js')) {
                 fs.unlinkSync(__dirname + '/swaggerDocuments.js')
            }
            let filenames =   glob.sync('**/routers/*.json', { cwd: `${src}` });
            for (let index = 0; index < filenames.length; index++) {
                const filename = filenames[index];
                let entityName = '';
                let router = '';
                if (filename) {
                    entityName = ((filename).split('/'))[0];
                    router = require(src + filename);
                    routerMaker(entityName, router)
                    swagger.SwaggerMaker(router,entityName);
                }
            } 
            setTimeout(() => {
                if(fs.existsSync(__dirname + '/swaggerDocuments.js')){
                    resolve(true); 
                } 
            }, filenames.length * 200); 
        })
    })

}
//**************************************************************************
module.exports = Bundler;