let Database = {}
const { Sequelize, DataTypes } = require("sequelize");
let mongoose = require('mongoose');
//******************************************************************************************************************
/*Database.start = () => {
    return new Promise((resolve, reject) => {
        const sequelize = new Sequelize(
            process.env.DatabaseName,
            process.env.DatabaseUser,
            process.env.DatabasePassword,
            {
                host: process.env.DatabaseHost,
                dialect: 'mysql',
                port: process.env.DatabasePort
            }
        );
        sequelize.authenticate().then(() => {
            Database.db = sequelize;
            console.log('Connection has been established successfully.');
            resolve(true)
        }).catch((error) => {
            reject(error)
            console.error('Unable to connect to the database: ', error);
        });
    })
}
Database.modelMaker = (entityName, entityModel) => { 
    if (!entityName || !entityModel) { return false; }
    else {  
        global.Models[entityName] = Database.db.define(String(entityName), entityModel);
        Database.db.sync({ force: false }).then(() => {
            console.log(`${entityName} table created successfully!`);
        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });
    }
}*/
//******************************************************************************************************************
Database.modelMaker = async (entityName, entityModel) => {
    try {
      if (Database.db && entityName && entityModel && Object.keys(entityModel).length) {
        const schema = new mongoose.Schema({ ...entityModel });
        global.Models[entityName] = mongoose.model("user", schema);
      }
    } catch (error) { return false }
  } 
  
  Database.connect = async (username, password, host, port, dbname) => {
    try {
      Database.connection = await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${dbname}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true });
      Database.connection
      .on('open', console.log( 'Database connection: open'))
      .on('close', console.log( 'Database connection: close'))
      .on('disconnected', console.log( 'Database connection: disconnecting'))
      .on('disconnected', console.log( 'Database connection: disconnected'))
      .on('reconnected', console.log( 'Database connection: reconnected'))
      .on('fullsetup', console.log( 'Database connection: fullsetup'))
      .on('all', console.log( 'Database connection: all'))
      .on('error', console.error.bind( 'MongoDB connection: error:'));
    } catch (error) { console.log(error); }
  }
   
  Database.close = async () => {
    try {
      await Database.connection.close();
    } catch (error) { console.log(error); }
  }
   
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
//******************************************************************************************************************
module.exports = Database;