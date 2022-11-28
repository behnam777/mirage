var Swagger = {}
var fs = require('fs'); 
var path = require('path'); 
//*************************************************************
Swagger.start = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(data.url && data.method)) { resolve(false) }
            else{
global.comment+=`/** 
 * @swagger
 * ${data.url}:
 *  ${data.method}:
 *      summary : ${data.summary || 'no summery'}
 *      description: ${data.description || 'no description'}
 `
                resolve(true)
            }
        } catch (error) { resolve(false)}
    })
}
//*************************************************************
module.exports = Swagger;