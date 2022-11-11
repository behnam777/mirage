var Services = new Object(); 
var glob = require('glob');
var fs = require('fs');
var path = require('path'); 
var {idMaker,hashCode} =  require('./security');
var ODM = require('./ODM');
var server = require("./server");
var deleteFolder = require('./deleteFolder'); 
var routerMaker = require('./routerMaker'); 
global.duix = require('duix');
// is valible for use in src files.
global.Functions  = {} //FUNCTIONS 
global.Entities = [] //ENTITIES       
global.Routers  = {} //ROUTERS
global.Models = {} //MODELS 
global.idMaker = idMaker;
global.hash = hashCode;
//****************************************************************************************************************** 
    //**************************************************************************Functions
    glob
    .sync('**/functions.js', { cwd: `${process.env.SourcePath}` })
    .map(filename => {
        let entity = ((filename).split('/'))[1]; 
        (global.Entities).push(entity)
        global.Functions[entity] = require(process.env.SourcePath+filename);
    }) 
    //*************************************************************************Models
    glob
    .sync('**/model.js', { cwd: `${process.env.SourcePath}` })
    .map(filename => {
        let entityName = ''; 
        let entityModel = '';
        if(filename){
            entityName = ((filename).split('/'))[1];  
        } 
        if(entityName){
            entityModel = require(process.env.SourcePath+filename); 
        }
        if(entityName && entityModel && entityModel['model']){
            if(process.env.DatabaseType == 'mongodb'){ 
                ODM.modelMaker(entityName , entityModel['model'])
            }
            if(process.env.DatabaseType == 'postgresql'){
                //TODO : ORM.modelMaker()
            }
        }
     }) 
    //*************************************************************************Routers
    deleteFolder.delete('./factory/routes',(result)=>{
        if (!fs.existsSync(__dirname+'/routes')){
            fs.mkdirSync(__dirname+'/routes');
        }
        glob
        .sync('**/routers.js', { cwd: `${process.env.SourcePath}` })
        .map(filename => {
            routerMaker(filename)
        })  
    }) 
//******************************************************************************************************************
module.exports = Services;