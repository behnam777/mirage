//**********************************************************
let signup = async (req,client)=>{ 
    if(req && req.body && req.body.phonenumber){
        let finduser = await User.findOne({phoneNumber:req.body.phonenumber}).exec();
        if(finduser || finduser[0]){return ({state:false,status:204, message:103})}
        else{
            let UserModel =  (global.Models['user']) 
            var newUser = new UserModel({   
                ID:global.idMaker(true),
                firstName : '',
                lastName : '',
                userName : '',
                psw : '',
                email : '',
                phoneNumber : req.body.phonenumber,
                //activationCode : global.idMaker(), 
                activationCode : '1111', 
                profilePhoto : '',
                role : 'A3',
                roleAsName : '',
                enability : false
            });
            newUser.save((error)=>{
                if (error){ return ({state:false,status:500, message:101})      } 
                else{       return ({state:true, message:102 , status:200})     }
            });
        }
    }
} 
//**********************************************************
module.exports = {signup};