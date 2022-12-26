var Swagger = {}
var fs = require('fs');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var path = require('path');
var Logger = require('./logger.js');
var { idMaker } = require('./security')
var miragePath = path.dirname(require.main.filename);

//***********************************************
Swagger.start = () => {
    return new Promise((resolve, reject) => {
        try {
            global.comment = '';
            const swaggerOptions = {
                definition: {
                    openapi: '3.0.0',
                    info: {
                        title: process.env.SwaggerTitle,
                        version: process.env.SwaggerVersion
                    },
                    servers: [
                        {
                            url: process.env.SwaggerUrl
                        }
                    ]
                },
                apis: [__dirname + "/swaggerDocuments.js"]
            }
            const swaggerSpec = swaggerJSDoc(swaggerOptions)
            Swagger.serve = swaggerUi.serve
            Swagger.ui = swaggerUi.setup(swaggerSpec, {
                customCss: '.swagger-ui .topbar { display: none }',
                customSiteTitle: "a4baz API",
            })
            resolve(true)
        }
        catch (error) { console.log(error); resolve(false) }
    })
}
//***********************************************
Swagger.SwaggerMaker = async (importData,entityName) => {
    try {
        if (importData) { 
            //for (let i = 0; i < importData.length; i++) {
                //const data = importData[i];
                const data = importData;
                if (!(data.url && data.method)) { return false; }
                let comment = ''
comment = `
 /** 
 * @swagger
 * ${data.url}:
 *  ${data.method}:
 *      summary : ${data.summary || 'no summery'}
 *      tags:
 *        - ${entityName}  
 *      description: ${data.description || 'no description'}
 `
                if (data.parameters && (data.parameters).length) {
comment +=` *      parameters:
 `
                    for (let index = 0; index < (data.parameters).length; index++) {
                        const parameter = (data.parameters)[index];
comment +=` *        - name : ${parameter.name}
 *          description: ${parameter.description}
 *          in : ${parameter.location}  
 *          type: ${parameter.type}
 `
                    }
                }
                if (data.body) {

comment +=` *      requestBody: 
 *          description : ${data.body.description}
 *          requierd : ${data.body.required}
`
                    if (data.body.data) {
comment +=` *          content:
 *             ${data.body.type}:
 *                schema:
 *                  type: object     
 *                  properties:  
 `

                        for (let index = 0; index < Object.keys(data.body.data).length; index++) {
                            const bodyItem = Object.keys(data.body.data)[index];
comment +=` *                     ${bodyItem}:
`
                            if (typeof (data.body.data[bodyItem]) == "string" || typeof (data.body.data[bodyItem]) == "number") { //EX : data{name:"behnam"}
                                // nothing to do
comment +=` *                      type: ${typeof (data.body.data[bodyItem]) == "object" && Array.isArray(data.body.data[bodyItem]) ? "array" : typeof (data.body.data[bodyItem])}
`
                            }
                            if (Array.isArray(data.body.data[bodyItem])) {//EX : data{name:[]}
comment +=` *                      type: ${typeof (data.body.data[bodyItem]) == "object" && Array.isArray(data.body.data[bodyItem]) ? "array" : typeof (data.body.data[bodyItem])}
`
                                if (data.body.data[bodyItem] && data.body.data[bodyItem][0] && typeof (data.body.data[bodyItem][0]) == "object" && !Array.isArray(data.body.data[bodyItem][0])) {
                                    //EX : data{name:[a{},b{}]}
comment +=` *                         items :
`
                                    for (let index2 = 0; index2 < Object.keys(data.body.data[bodyItem][0]).length; index2++) {
                                        const BodyItemPropertieItem = Object.keys(data.body.data[bodyItem][0])[index2];
                                        
comment +=` *                           ${BodyItemPropertieItem} :
 *                              type : ${typeof (data.body.data[bodyItem][0][BodyItemPropertieItem])}
`
                                    }
                                }
                                else {
                                    //EX : data{name:[]}
                                    //nothing
                                }
                            }
                            if (typeof (data.body.data[bodyItem]) == "object" && !Array.isArray(data.body.data[bodyItem]) && Object.keys(data.responses.data[responsesItem]).length) {
                                //EX : data{name:{a:'',b:''}} 
                                
comment +=` *                        properties :
`
                                for (let index3 = 0; index3 < Object.keys(data.body.data[bodyItem]).length; index3++) {
                                    const BodyObjItemPropertie = Object.keys(data.body.data[bodyItem])[index3];
comment +=` *                            ${BodyObjItemPropertie} : 
 *                                type : ${typeof (data.body.data[bodyItem][BodyObjItemPropertie])} 
`
                                }
                            }
                        }
                    }

                }




                if (data.responses) {

comment +=` *      responses:
 *          '200': 
 *            description : ${data.responses.description}
 *            type : ${data.responses.type}
`
                    if (data.responses.data) {
comment +=` *            content:
 *                ${data.responses.type}:
 *                   schema:
 *                     type: object
 *                     properties:
`
                    }
                    if (data.responses.data) {

                        for (let index = 0; index < Object.keys(data.responses.data).length; index++) {
                            const responsesItem = Object.keys(data.responses.data)[index];
comment +=
` *                      ${responsesItem}:
 *                        type: ${typeof (data.responses.data[responsesItem]) == "object" && Array.isArray(data.responses.data[responsesItem]) ? "array" : typeof (data.responses.data[responsesItem])}
`
                            if (typeof (data.responses.data[responsesItem]) == "string" || typeof (data.responses.data[responsesItem]) == "number") { //EX : data{name:"behnam"}
                                // nothing to do 
                            }
                            if (Array.isArray(data.responses.data[responsesItem])) {//EX : data{name:[]} 
                                if (data.responses.data[responsesItem] && data.responses.data[responsesItem][0] && typeof (data.responses.data[responsesItem][0]) == "object" && !Array.isArray(data.responses.data[responsesItem][0])) {
                                    //EX : data{name:[a{},b{}]} 
                                    comment +=
                                        `*                         items :
`
                                    for (let index2 = 0; index2 < Object.keys(data.responses.data[responsesItem][0]).length; index2++) {
                                        const responsesItemPropertieItem = Object.keys(data.responses.data[responsesItem][0])[index2];

                                        comment +=
`*                            ${responsesItemPropertieItem} :
 *                                type : ${typeof (data.responses.data[responsesItem][0][responsesItemPropertieItem])}
`
                                    }
                                }
                                else {
                                    //EX : data{name:[]}
                                    //nothing
                                }
                            }
                            if (typeof (data.responses.data[responsesItem]) == "object" && !Array.isArray(data.responses.data[responsesItem]) && Object.keys(data.responses.data[responsesItem]).length) {
                                //EX : data{name:{a:'',b:''}} 
                                
comment +=` *                        properties :
`
                                for (let index3 = 0; index3 < Object.keys(data.responses.data[responsesItem]).length; index3++) {
                                    const ResItemPropertie = Object.keys(data.responses.data[responsesItem])[index3];
comment +=` *                            ${ResItemPropertie} : 
 *                                type : ${typeof (data.responses.data[responsesItem][ResItemPropertie])} 
`
                                }
                            }
                        }
                    }
                }
                comment += " */"
                comment += "\n"
                fs.appendFile(__dirname + "/swaggerDocuments.js", comment, "utf8", function (err) { return true; });


            //}
        }
    } catch (error) {
        console.log(error);
        Logger.log('error', error, 'error')
        return false;
    }
}

module.exports = Swagger;