'use strict';
//**************************************************************************
var Services = new Object(); 
var glob = require('glob');
var fs = require('fs');  
var {idMaker,hashCode,signature,verify} =  require('./security');
var ODM = require('./ODM'); 
var deleteFolder = require('./deleteFolder'); 
var routerMaker = require('./routerMaker');  
var path = require('path');
var logger = require('./logger');
var absolutePath = path.dirname(require.main.filename);
var src = path.dirname(require.main.filename) + '/src/';
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
try {
    logger.log('error','my error','error')
} catch (error) {logger.log('error',error,'error')}
glob
.sync('**/functions.js', { cwd: `${src}` })
.map(filename => {
    let entity = ((filename).split('/'))[0]; 
    (global.Entities).push(entity)
    global.Functions[entity] = require(src+filename);
}) 
//**************************************************************************Models
glob
.sync('**/model.json', { cwd: `${src}` })
.map(filename => {
    let entityName = ''; 
    let entityModel = '';
    if(filename){entityName = ((filename).split('/'))[0];  } 
    if(entityName){entityModel = require(src+filename); } 
    if(entityName && entityModel && entityModel){
        if(process.env.DatabaseType == 'mongodb'){ ODM.modelMaker(entityName , entityModel)}
        if(process.env.DatabaseType == 'postgresql'){/*TODO : ORM.modelMaker()*/}
    }
}) 
//**************************************************************************Views
glob
.sync('**/**.jsx', { cwd: `${src}` })
.map(result => { 
    let entityName = ''; 
    let filename = '';
    if(result){entityName = ((result).split('/'))[0];filename=((result).split('/'))[1]  } 
    let filePath = src + result;
    let entityFolderPath = absolutePath+'/pages/'+entityName
    console.log(filePath,entityFolderPath+'/'+filename);
    if(!fs.existsSync(entityFolderPath)){
        fs.mkdirSync(entityFolderPath);
        fs.copyFileSync(filePath,entityFolderPath+'/'+filename)
    }
    else{
        fs.copyFileSync(filePath,entityFolderPath+'/'+filename)
    }
}) 
let generalStyleContent = ''
glob
.sync('**/**.css', { cwd: `${src}` })
.map(result => {  
    let entityName = ''; 
    let filename = '';
    if(result){entityName = ((result).split('/'))[0];filename=((result).split('/'))[1]  } 
    let filePath = src + result;
    generalStyleContent += fs.readFileSync(filePath,{encoding:'utf8'}) 
    generalStyleContent += '\n'; 
    fs.writeFileSync(absolutePath+'/styles/styles.css',generalStyleContent) 
}) 
//**************************************************************************Routers
deleteFolder.delete(absolutePath+'/factory/routes',(result)=>{
    if (!fs.existsSync(__dirname+'/routes')){fs.mkdirSync(__dirname+'/routes');}
    glob
    .sync('**/routers.json', { cwd: `${src}` })
    .map(filename => {
        let entityName = ''; 
        let routers = ''; 
        if(filename){
            entityName = ((filename).split('/'))[0];  
            routers = require(src+filename);
            routerMaker(entityName , routers)
        }   
    })  
}) 
//**************************************************************************
module.exports = Services;