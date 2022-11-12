const mongoose = require('mongoose');
let Database =  {} 
//******************************************************************************************************************
Database.connection = mongoose.connection; 
try {
  Database.connection
    .on('open', console.info.bind(console, 'Database connection: open'))
    .on('close', console.info.bind(console, 'Database connection: close'))
    .on('disconnected', console.info.bind(console, 'Database connection: disconnecting'))
    .on('disconnected', console.info.bind(console, 'Database connection: disconnected'))
    .on('reconnected', console.info.bind(console, 'Database connection: reconnected'))
    .on('fullsetup', console.info.bind(console, 'Database connection: fullsetup'))
    .on('all', console.info.bind(console, 'Database connection: all'))
    .on('error', console.error.bind(console, 'MongoDB connection: error:'));
} catch (error) { console.log(error); }
//******************************************************************************************************************
Database.connect = async (username, password, host , port , dbname)=>{
  try { 
    await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${dbname}?authSource=admin`,{useNewUrlParser: true,useUnifiedTopology: true});
  } catch (error) {console.log(error);  }
}
//******************************************************************************************************************
Database.close= async ()=>{
  try {
    await Database.connection.close();
  } catch (error) { console.log(error); }
}
//******************************************************************************************************************
if(process.env.DatabaseAutoConnect == 'yes'){ 
    Database.connect(
        process.env.DatabaseUser,
        process.env.DatabasePassword,
        process.env.DatabaseHost,
        process.env.DatabasePort,
        process.env.DatabaseName
    );
}
//******************************************************************************************************************
module.exports = Database;