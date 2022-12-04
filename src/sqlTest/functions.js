let register = async (req,client)=>{ 
    try {
         //console.log(client);
    } catch (error) {  
        return({status:500,message:'internal server error',state:false});
    } 
} 
//***********************************************
module.exports = {register};