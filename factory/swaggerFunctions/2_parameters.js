var Swagger = {}
var fs = require('fs'); 
var path = require('path'); 
//*************************************************************
Swagger.start = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(data.parameters && (data.parameters).length)) { resolve(false) }
            else{ 
                    global.comment +=
`*      parameters:
`
                    for (let index = 0; index < (data.parameters).length; index++) {
                        const parameter = (data.parameters)[index];
                    global.comment +=
`*        - name : ${parameter.name}
 *          description: ${parameter.description}
 *          in : ${parameter.location}  
 *          type: ${parameter.type}
 `
                        resolve(true)
                    } 
            }
        } catch (error) { resolve(false)}
    })
}
//*************************************************************
module.exports = Swagger;