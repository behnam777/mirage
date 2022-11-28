var Swagger = {}
var fs = require('fs'); 
var path = require('path'); 
//*************************************************************
Swagger.start = (data) => {
    return new Promise((resolve, reject) => {
        try {
            
            resolve(true)
        } catch (error) { resolve(false)}
    })
}
//*************************************************************
module.exports = Swagger;