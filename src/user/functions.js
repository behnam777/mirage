//**********************************************************
let signup = async (req,client)=>{ 
    if(req && req.body && req.body.phonenumber){
        let finduser = await User.findOne({phoneNumber:req.body.phonenumber}).exec();
        if(finduser || finduser[0]){return ({state:false,status:204, message:'user not found'})}
        else{
            let UserModel =  (global.Models['user']) 
            var newUser = new UserModel({   
                ID:global.idMaker(true),
                firstName : '',
                lastName : '',
                userName : '',
                psw : '',
                email : '',
                lastSMSSendTime : Date.now(),
                phoneNumber : req.body.phonenumber,
                //activationCode : global.idMaker(), 
                activationCode : '1111', 
                profilePhoto : '',
                role : 'A3',
                roleAsName : '',
                enability : false
            });
            newUser.save((error)=>{
                if (error){ return ({state:false, message:'error on save user',  status:500})      } 
                else{       return ({state:true,  message:'signup successfully' , status:200})     }
            });
        }
    }
} 
//**********************************************************
let login = async (req,client)=>{ 
    if(req && req.body){
        try {    
            let Token = req.headers.authorization;
            let data  = req.body;
            let UserModel =  (global.Models['user'])
            if( Token && (Token != undefined)  && (Token != 'undefined')  && (Token != 'null') && (Token != null)){  
                global.verify(Token,true)
                .then((result)=>{ 
                    if(result.state){   return({state:true,  message:'The signature updated',signatures:result.signatures});}
                    else{               return({state:false, message:result.message+' login again' }); }
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
                            Model.findOneAndUpdate({ phonenumber:data.phonenumber },{$set:{activationSMSCode:'' ,enability:true }},{new:true},(err,entity)=>{
                                if(err){
                                    return {state:false , message:'error on update entity',signatures:[]}
                                } 
                                else{
                                    return {state:true , message:entity,signatures:result.signatures}
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
//**********************************************************
let sendSMSagain = async (req,client)=>{ 
    try {
        let data = req.body;
        let UserModel =  (global.Models['user'])
        if(data && data.phonenumber && (data.phonenumber).length == 10 ){ 
            let user = await UserModel.findOne({ phonenumber:data.phonenumber}); 
            if( user && !user.enability){
                if( Date.now() - (user['lastSMSSendTime']) > 120000){
                    user['activationSMSCode'] = '1111'
                    user['lastSMSSendTime'] =  Date.now();
                    user.save();
                    return({message:'The activation code has been sent again',state:true})
                }
                else{ return({status:204,message:'Wait at least two minutes from the previous transmission',state:false})}
            }
            else{ return({status:204,message:'User not found. Please enter your phone number without zero',state:false})}
        }
        else{ return({status:204,message:' The phone number is not correct',state:false})}
    } catch (error) {  
        return({status:500,message:'internal server error',state:false});
    } 
} 
//***********************************************
  
module.exports = {signup,login,sendSMSagain};