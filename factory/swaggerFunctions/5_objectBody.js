var Swagger = {}
var fs = require('fs'); 
var path = require('path'); 
//*************************************************************
Swagger.start = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(data.body && data.body.data)) {resolve(false)}
            else{
                global.comment +=
` *          content:
 *             ${data.body.type}:
 *                schema:
 *                  type: object     
 *                  properties:  
`
                resolve(true)
            }
        } catch (error) { resolve(false)}
    })
}
//*************************************************************
module.exports = Swagger;