var Swagger = {}
var fs = require('fs'); 
var path = require('path'); 
//*************************************************************
Swagger.start = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(data.body)) { resolve(false) }
            else{
                global.comment +=
`*      requestBody: 
 *          description : ${data.body.description}
 *          requierd : ${data.body.required}
`
                resolve(true)
            }
        } catch (error) { resolve(false)}
    })
}
//*************************************************************
module.exports = Swagger;