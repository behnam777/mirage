const mongoose = require("mongoose"); 
if(process.env.DatabaseName,process.env.DatabasePassword,process.env.DatabaseHost,process.env.DatabasePort,process.env.DatabaseName){

    const mongoDB = 'mongodb://'+process.env.DatabaseName+':'+process.env.DatabasePassword+'@'+process.env.DatabaseHost+':'+process.env.DatabasePort+'/'+process.env.DatabaseName;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }); 
    const db = mongoose.connection; 
    console.log(db);
    db.on("error", console.error.bind(console, "MongoDB connection error:"));

}