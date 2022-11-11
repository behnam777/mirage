var security = new Object();
var jwt =  require('jsonwebtoken');   
var Logger = require('./logger');
//******************************************************************************************
security.Initializing = ()=>{
    return new Promise((resolve,reject)=>{
        try {  
            security.salt = process.env.Salt
            resolve(true)  
        }catch(error){ reject(error) }
    })
}
//******************************************************************************************
security.sign = (sign,data,coded,refresh)=>{
    return new Promise((resolve,reject)=>{
        try { 
            let UserModel =  (global.Models['user'])  
            //*************************************************************************************************************************
            if(sign && !data && !coded){ //verify sign and verify user
                jwt.verify(sign,security.salt ,  function(err, verified) { 
                    if(err){resolve({state:false,message:'error 1 on Authentication module :   '+err} )}
                    if(err  || !verified){   resolve({state:false,message:'not verified'});   }
                    if(!err ||  verified){
                        let email = verified.data; // must be email for user
                        UserModel.findOne({ 'email': email }, function (err, user) {
                            if (err){res.send({state:false, message:'find has error'})}
                            else{ 
                                if(user){
                                    if(email && refresh == null){
                                        resolve({state:true,client:user}); 
                                    }
                                    if(email && refresh != null){  
                                        jwt.sign({data: email},'KaPdSgUkXp2s5v8y' ,{ expiresIn: '2d' },(err,sign)=>{  
                                            if(err){    resolve('Authentication on make token :   '+err)     }
                                            else{       resolve({state:true,sign:sign,client:user});                    }
                                        });  
                                    }
                                }
                                else{

                                }
                            }
                        })
                    }
                })
            }
            //*************************************************************************************************************************
            if(!sign  && data && !coded){//make sign
                jwt.sign({data: data}, security.salt ,{ expiresIn: '6d' },(err,sign)=>{  
                    if(err){resolve('Authentication has an error on make token :   '+err)}
                    else{   resolve({state:true,sign:sign});             }
                });
            }
            if(!data && !sign  &&  coded){//only decode sign and return data
                var decoded = jwt.decode(coded);
                setTimeout(() => {
                    resolve({state:true,decoded:decoded.data,data:decoded.data}); 
                }, 20);
            }
            if(!data && !sign  && !coded){//make sign
                resolve({state:false,message:'Signature, bad parameters'});
            }
            //else{   resolve({state:false,message:'Signature, bad parameters'});  }
        }
        catch(error){resolve('Authentication :   '+error)} 
    })
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