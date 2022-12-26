
//********************************************************************************************************************************************************************
let smsConfirm = async (req,client)=>{ 
    if(req && req.body){
        try {    
            let Token = req.headers.accessToken;
            let data  = req.body;
            let UserModel =  (global.Models['user'])
            if( Token && (Token != undefined)  && (Token != 'undefined')  && (Token != 'null') && (Token != null)){  
                global.verify(Token,true)
                .then((result)=>{ 
                    if(result.state){   return({state:true,status:200,  message:'The signature updated',accessToken:result.accessToken,refreshToken:result.refreshToken });}
                    else{               return({state:false, message:result.message+' login again' ,status:204}); }
                }) 
                .catch((error) => { reject('login ,on make new token  :' + error);  }) 
            } 
            else if (data && data.phonenumber && (data.phonenumber).length == 10 ) {  
                let user = await UserModel.findOne({ phonenumber:data.phonenumber}); 
                if(!user){return ({state:false, message:' User not found ' ,status:204 });}
                if(user && user.state == 'deleted'){ return ({state:false, message:' user is deleted' ,status:204 });}  
                if(user && user['activationSMSCode'] === data.code){
                    global.signature(user['phonenumber'])
                    .then((result)=>{   
                        if(result.state){  
                            UserModel.findOneAndUpdate({ phonenumber:data.phonenumber },{$set:{activationSMSCode:'' ,enability:true }},{new:true},(err,entity)=>{
                                if(err){
                                    return {state:false , message:'error on update entity',signatures:[],status:500}
                                } 
                                else{
                                    return {state:true , message:entity,accessToken:result.accessToken,refreshToken:result.refreshToken ,status:200}
                                }
                            })   
                        }
                        else{  
                            return({state:false,  message:'making signature for login failed' ,status:401 }); 
                        }
                    })
                    .catch((error) => { 
                        return({state:false,message: 'making new token has error :'+error ,status:500});  
                    }) 
                }else{  
                    return({state:false, message:' activation code is not true' ,status:401}); 
                } 
            }
            else{
                return({state:false, message:'The phone number is not correct ',status:204});  
            }
        }catch (error) { 
            return({state:false, message:'login internal error ',status:500});  
        }
    }
} 
//********************************************************************************************************************************************************************
module.exports = {smsConfirm};