var security = new Object();
var jwt =  require('jsonwebtoken');    
var Logger = require('./logger');
//******************************************************************************************
security.Initializing = ()=>{
    return new Promise((resolve,reject)=>{
        try {  security.salt = process.env.Salt ; resolve(true)  }catch(error){ reject(error) }
    })
}
//******************************************************************************************
security.signature = async (fieldValue,Model,FieldName)=>{//field is data like {id:idValue} must be in model
    let fieldName  = FieldName || process.env.AuthenticationField;
    let model      = Model || process.env.AuthenticationModel;
    if(!(fieldName && model && fieldValue)){return {state:false , message:'imported data is incomplete',signatures:[]};}
    if(!(global.Models[model])){return {state:false , message:'data model not found',signatures:[]};}
    else{ 
        let Model =  (global.Models[model]) 
        const token1 = await jwt.sign({ data: fieldValue },security.salt,{expiresIn: process.env.AuthenticationTime1});  
        const token2 = await jwt.sign({ data: fieldValue },security.salt,{expiresIn: process.env.AuthenticationTime2});  
        Model.findOneAndUpdate({ [fieldName]:fieldValue },{$set:{jwtTokens:[token1,token2]}},{new:true},(err,entity)=>{
            if(err){return {state:false , message:'error on update entity',signatures:[]}}
            else{return {state:true , message:'entity jwt token updated',signatures:[token1,token2]}}
        }) 
    }
}
//******************************************************************************************
security.verify = async (signature,refresh ,Model ,FieldName)=>{
    let fieldName  = FieldName || process.env.AuthenticationField;
    let model      = Model || process.env.AuthenticationModel;
    if(!(signature && model && fieldName)){return {state:false , message:'imported data is incomplete',entity:''};}
    if(!(global.Models[model])){return {state:false , message:'data model not found',entity:''};}
    else{
        const Model =  (global.Models[model]) 
        const fieldValue = await jwt.verify(signature, security.salt);
        const entity = await Model.findOne({ [fieldName]:fieldValue });
        if(!entity){return {state:false , message:'entity not found',entity:''}}
        else if(refresh){security.signature(model,fieldName,fieldValue).then((result)=>{
             return {state:true , message:'verified successfully and tokens are refresh',entity:entity,signatures:result.signatures};
        }).catch((reason)=>{return {state:false , message:'verified but refresh the tokens has error',entity:''};})}
        else{return {state:true , message:'verified successfully',entity:entity};}
    }
}  
//******************************************************************************************
security.hashCode = (s) => {  
    try {
        let Hashed =  Math.abs(s.split("").reduce(function(a,b){a=((a<<s.length)-a)+b.charCodeAt(0);return a&a},0)).toString();
        return  Hashed;
    } catch (error) {Logger.log('error',error,'error',false,false,null);} 
}  
//******************************************************************************************
security.deHashCode = (s) => {  
    try {
        let deHashed1 = s.replace('R','=')
        let deHashed2 = new Buffer(deHashed1, 'base64').toString('ascii');
        return  deHashed2;           
    } catch (error) {Logger.log('error',error,'error',false,false,null);} 
}
//******************************************************************************************
security.idMaker = (complex) => { 
        try {
                var S4 = function() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1);};
                let final
                if(complex){
                    final = 'a'+S4()+S4()+S4()+'z'
                }
                else{
                    final = String(Math.floor(Math.random() * 9000 + 1000)); // make 4 digit random number;
                }
                return final; 
        } catch (error) {Logger.log('error',error,'error',false,false,null);} 
}; 
//******************************************************************************************
module.exports = security;