let ODM = {}
let mongoose = require('mongoose');
//*******************************************************************************************
ODM.modelMaker = async (entityName , entityModel)=>{
    try {
        if(entityName && entityModel && Object.keys(entityModel).length){  
            const schema = new  mongoose.Schema({ ...entityModel }); 
            console.log( schema);
            global.Models[entityName] = mongoose.model("user" , schema );
        }
    } catch (error) { return false}
}
//*******************************************************************************************
module.exports = ODM;  