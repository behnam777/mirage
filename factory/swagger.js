var Swagger = {}
var fs = require('fs');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var path = require('path');
var { idMaker } = require('./security')
var miragePath = path.dirname(require.main.filename);

//***********************************************
Swagger.start = async () => { 
        try {
            console.log('D');
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
                apis: [__dirname  + '/4455.js']
            }
            console.log(__dirname + '/4455.js');
            const swaggerSpec =await swaggerJSDoc(swaggerOptions)
            Swagger.serve = swaggerUi.serve
            Swagger.ui = await swaggerUi.setup(swaggerSpec, {
                customCss: '.swagger-ui .topbar { display: none }',
                customSiteTitle: "a4baz API",
            }) 
            return(true)
        }
        catch (error) { console.log(error);; return(false) } 
}
//***********************************************
Swagger.SwaggerMaker = async (importData) => {
    try {

        if (importData && importData.length) {
            for (let i = 0; i < importData.length; i++) {
                const data = importData[i];

                if (!(data.url && data.method)) { continue; }

                let comment = ''
                comment = `
 /** 
 * @swagger
 * ${data.url}:
 *  ${data.method}:
 *      summary : ${data.summary || 'no summery'}
 *      description: ${data.description || 'no description'}
 *`
                if (data.parameters) {
                    for (let index = 0; index < data.parameters.length; index++) {
                        const parameter = data.parameters[index];
                        comment += `
 *      parameters:
 *        - in : "path"
 *          name : ${parameter.name}
 *          required: ${parameter.required}
 *          description : ${parameter.description}
 *          schema :
 *              type: ${parameter.type}
 * 
`
                    }
                }
                if (data.body) {

                    comment +=
`*      requestBody: 
 *          description : ${data.body.description}
 *          requierd : ${data.body.required}
 *          content:
 *             ${data.body.type}:
 *                schema:
 *                     
`

                    for (let index = 0; index < Object.keys(data.body.data).length; index++) {
                        const bodyItem = Object.keys(data.body.data)[index];
                        comment +=
                            `*                     ${bodyItem}:
 *                         type: ${typeof (data.body.data[bodyItem]) == "object" && Array.isArray(data.body.data[bodyItem]) ? "array" : typeof (data.body.data[bodyItem])}
`
                        if (typeof (data.body.data[bodyItem]) == "string" || typeof (data.body.data[bodyItem]) == "number") { //EX : data{name:"behnam"}
                            // nothing to do
                        }
                        if (Array.isArray(data.body.data[bodyItem])) {//EX : data{name:[]}
                            if (data.body.data[bodyItem] && data.body.data[bodyItem][0] && typeof (data.body.data[bodyItem][0]) == "object" && !Array.isArray(data.body.data[bodyItem][0])) {
                                //EX : data{name:[a{},b{}]}
                                comment +=
                                    `*                         items :
`
                                for (let index2 = 0; index2 < Object.keys(data.body.data[bodyItem][0]).length; index2++) {
                                    const BodyItemPropertieItem = Object.keys(data.body.data[bodyItem][0])[index2];
                                    comment +=
                                        `*                           ${BodyItemPropertieItem} :
 *                               type : ${typeof (data.body.data[bodyItem][0][BodyItemPropertieItem])}
`
                                }
                            }
                            else {
                                //EX : data{name:[]}
                                //nothing
                            }
                        }
                        if (typeof (data.body.data[bodyItem]) == "object" && !Array.isArray(data.body.data[bodyItem])) {
                            //EX : data{name:{a:'',b:''}}
                            comment +=
                                `*                         properties :
`
                            for (let index3 = 0; index3 < Object.keys(data.body.data[bodyItem]).length; index3++) {
                                const BodyItemPropertie = Object.keys(data.body.data[bodyItem])[index3];
                                comment +=
                                    `*                           ${BodyItemPropertie} :
 *                               type : ${typeof (data.body.data[bodyItem][BodyItemPropertie])} 
`
                            }
                        }
                    }
                }




                if (data.responses) {

                    comment +=
                        `*      responses:
 *          200 : 
 *          description : ${data.responses.description}
 *          content:
 *              ${data.responses.type}:
 *                  schema:
 *                     
`

                    for (let index = 0; index < Object.keys(data.responses.data).length; index++) {
                        const responsesItem = Object.keys(data.responses.data)[index];
                        comment +=
                            `*                     ${responsesItem}:
 *                         type: ${typeof (data.responses.data[responsesItem]) == "object" && Array.isArray(data.responses.data[responsesItem]) ? "array" : typeof (data.responses.data[responsesItem])}
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
                                        `*                           ${responsesItemPropertieItem} :
 *                               type : ${typeof (data.responses.data[responsesItem][0][responsesItemPropertieItem])}
`
                                }
                            }
                            else {
                                //EX : data{name:[]}
                                //nothing
                            }
                        }
                        if (typeof (data.responses.data[responsesItem]) == "object" && !Array.isArray(data.responses.data[responsesItem])) {
                            //EX : data{name:{a:'',b:''}}

                            comment +=
                                `*                         properties :
`
                            for (let index3 = 0; index3 < Object.keys(data.responses.data[responsesItem]).length; index3++) {
                                const responsesItemPropertie = Object.keys(data.responses.data[responsesItem])[index3];

                                comment +=
                                    `*                           ${responsesItemPropertie} :
 *                               type : ${typeof (data.responses.data[responsesItem][responsesItemPropertie])} 
`
                            }
                        }
                    }
                }
                comment += "\n"
                comment += "*/"
                let id = idMaker()
                fs.writeFile(__dirname + "/swaggers/" + id + ".js", comment, 'utf8', (error) => { });


            }
        }
    } catch (error) {
        console.log(error);
    }
}
//***********************************************
/** 
 * @swagger
 * /api/books/addbook:
 *  put:
 *      summary : update mongodb
 *      description: update mongodb by put method
 *      parameters:
 *        - in : path
 *          name : id
 *          required: true
 *          description : book id
 *          schema :
 *              type: integer
 *      requestBody:
 *          requierd : true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref : '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: update sucessfully
 *              content:
 *                  application/json:
 *                    schema:
 *                      type: array
 *                      items:
 *                          $ref : '#components/schemas/Book'
 */
//***********************************************

module.exports = Swagger;