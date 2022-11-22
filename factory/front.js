let front = {}
const { exec } = require('child_process'); 
//*******************************************************************************************
front.start = ()=>{
    return new Promise((resolve, reject) => {
        try {
            exec('npm run build', (error, stdout, stderr) => {
                if (error) {
                  console.error(`error: ${error.message}`);
                  resolve(false);
                }
              
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  resolve(false);
                } 
                if(stdout){
                  resolve(true);
                }
            });
        } catch (error) {console.log(error);}
    })
}
//*******************************************************************************************
module.exports = front;