let Database = {} 
let orm = require('orm');  
let mongoose = require('mongoose');
//****************************************************************************************************************** 
if (process.env.DatabaseType == 'mongodb') { 
  //*******************************************************************************************
  Database.modelMaker = async (entityName, entityModel) => {
    try {
      if (Database.db && entityName && entityModel && Object.keys(entityModel).length) {
        const schema = new mongoose.Schema({ ...entityModel });
        global.Models[entityName] = mongoose.model("user", schema);
      }
    } catch (error) { return false }
  } 
  //******************************************************************************************************************
  Database.connect = async (username, password, host, port, dbname) => {
    try {
      Database.connection = await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${dbname}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true });
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
  }
  //******************************************************************************************************************
  Database.close = async () => {
    try {
      await Database.connection.close();
    } catch (error) { console.log(error); }
  }
  //******************************************************************************************************************
  Database.start = () => {
    return new Promise((resolve, reject) => {
      if (process.env.DatabaseAutoConnect == 'yes') {
        Database.connect(
          process.env.DatabaseUser,
          process.env.DatabasePassword,
          process.env.DatabaseHost,
          process.env.DatabasePort,
          process.env.DatabaseName
        );
      }
      resolve(true);
    })
  }
  //******************************************************************************************* 
}
if (process.env.DatabaseType == 'mysql') {
  //*******************************************************************************************
  Database.modelMaker = async (entityName, entityModel) => {
    try {
      if (Database.connection && entityName && entityModel && Object.keys(entityModel).length) {
        global.Models[entityName] = Database.connection.define('user', { ...entityModel });
      }
    } catch (error) { return false }
  } 
  //******************************************************************************************************************
  Database.connect = async (username, password, host, port, dbname) => {
    try {
      Database.connection = await orm.connect(`mysql://${username}:${password}@${host}:${port}/${dbname}?charset=utf8mb4`);
      Database.connection.on('connect',   'Database connection: open')
      Database.connection.on('error', console.error.bind(console, 'MongoDB connection: error:'));
    } catch (error) { console.log(error);  }
  }
  //******************************************************************************************************************
  Database.close = async () => {
    try {

    } catch (error) { console.log(error);  }
  }
  //******************************************************************************************************************
  Database.start = () => {
    return new Promise((resolve, reject) => {
      if (process.env.DatabaseAutoConnect == 'yes') {
        Database.connect(
          process.env.DatabaseUser,
          process.env.DatabasePassword,
          process.env.DatabaseHost,
          process.env.DatabasePort,
          process.env.DatabaseName
        );
      }
      resolve(true);
    })
  }
}
//******************************************************************************************************************
module.exports = Database;