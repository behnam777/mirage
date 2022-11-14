'use strict';
//**************************************************************************
var Services = new Object(); 
var glob = require('glob');
var fs = require('fs');
var path = require('path'); 
var {idMaker,hashCode,signature,verify} =  require('./security');
var ODM = require('./ODM'); 
var deleteFolder = require('./deleteFolder'); 
var routerMaker = require('./routerMaker');  
global.duix = require('duix');
//**************************************************************************All Globals
global.Functions  = {} //FUNCTIONS 
global.Entities = [] //ENTITIES       
global.Routers  = {} //ROUTERS
global.Models = {} //MODELS 
global.idMaker = idMaker;
global.hash = hashCode;
global.signature = signature;
global.verify = verify;
//**************************************************************************Functions
glob
.sync('**/functions.js', { cwd: `${process.env.SourcePath}` })
.map(filename => {
    let entity = ((filename).split('/'))[0]; 
    (global.Entities).push(entity)
    global.Functions[entity] = require(process.env.SourcePath+filename);
}) 
//**************************************************************************Models
glob
.sync('**/model.json', { cwd: `${process.env.SourcePath}` })
.map(filename => {
    let entityName = ''; 
    let entityModel = '';
    if(filename){entityName = ((filename).split('/'))[0];  } 
    if(entityName){entityModel = require(process.env.SourcePath+filename); } 
    if(entityName && entityModel && entityModel){
        if(process.env.DatabaseType == 'mongodb'){ ODM.modelMaker(entityName , entityModel)}
        if(process.env.DatabaseType == 'postgresql'){/*TODO : ORM.modelMaker()*/}
    }
}) 
//**************************************************************************Routers
deleteFolder.delete('./factory/routes',(result)=>{
    if (!fs.existsSync(__dirname+'/routes')){fs.mkdirSync(__dirname+'/routes');}
    glob
    .sync('**/routers.json', { cwd: `${process.env.SourcePath}` })
    .map(filename => {
        let entityName = ''; 
        let routers = ''; 
        if(filename){
            entityName = ((filename).split('/'))[0];  
            routers = require(process.env.SourcePath+filename);
            routerMaker(entityName , routers)
        }   
    })  
}) 
//**************************************************************************
module.exports = Services;