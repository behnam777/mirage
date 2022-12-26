
//********************************************************************************************************************************************************************
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
                else{ return({status:202,message:'Wait at least two minutes from the previous transmission',state:false})}
            }
            else{ return({status:203,message:'User not found. Please enter your phone number without zero',state:false})}
        }
        else{ return({status:204,message:' The phone number is not correct',state:false})}
    } catch (error) {  
        return({status:500,message:'internal server error',state:false});
    } 
} 
//********************************************************************************************************************************************************************
module.exports = {sendSMSagain};