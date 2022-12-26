
//********************************************************************************************************************************************************************
let login = async (req,client)=>{  
    if(req && req.body && req.body.phonenumber  && (req.body.phonenumber).length == 10){
        let UserModel =  (global.Models['user']) 
        let finduser = await UserModel.findOne({phonenumber:req.body.phonenumber}).exec();
        if(finduser && (Date.now() - (finduser['lastSMSSendTime']) < 120000)){
            return ({state:false,status:201, message:'Wait at least two minutes from the previous transmission'})
        }
        if(finduser && (Date.now() - (finduser['lastSMSSendTime']) > 120000)){
            finduser.activationSMSCode = '1111';  
            finduser.save(); 
            return ({state:true,  message:'activation Code successfully updated' , status:200}) 
        }
        else{
           
            var newUser = new UserModel({   
                ID:global.idMaker(true),
                firstName : '',
                lastName : '',
                userName : '',
                psw : '',
                email : '',
                lastSMSSendTime : Date.now(),
                phonenumber : req.body.phonenumber,
                //activationSMSCode : global.idMaker(), 
                activationSMSCode : '1111', 
                profilePhoto : '',
                role : 'A3',
                roleAsName : '',
                enability : false
            });
            newUser.save();
            return ({state:true,  message:'login successfully' , status:200}) 
        }
    }
    else{ return ({state:true,  message:'phonenumber is empty' , status:201})}
} 
//********************************************************************************************************************************************************************
module.exports = {login};