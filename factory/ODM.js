let ODM = {}
let mongoose = require('mongoose');
//*******************************************************************************************
ODM.modelMaker = async (entityName , entityModel)=>{
    try {
        console.log(entityModel);
        if(entityName && entityModel && Object.keys(entityModel).length){  
            const schema = new  mongoose.Schema({ ...entityModel });  
            global.Models[entityName] = mongoose.model("user"  , schema );
        }
    } catch (error) { return false}
}
//*******************************************************************************************
module.exports = ODM;  