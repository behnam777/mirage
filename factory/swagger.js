var Swagger = {}  
var swaggerJSDoc =  require('swagger-jsdoc');
var swaggerUi =  require('swagger-ui-express'); 
//***********************************************
Swagger.Initializing = ()=>{
    return new Promise((resolve,reject)=>{
        try { 
            const swaggerOptions = {
                
                definition:{
                    openapi:'3.0.0',
                    info:{
                        title:  process.env.SwaggerTitle,
                        version:process.env.SwaggerVersion
                    },
                    servers:[
                        {
                            url:process.env.SwaggerUrl 
                        }
                    ]
                },
                apis:['/a4baz/api/HTTP.js','/a4baz/api/routes/*.js']
            }
            const swaggerSpec = swaggerJSDoc(swaggerOptions) 
            Swagger.serve = swaggerUi.serve
            Swagger.ui = swaggerUi.setup(swaggerSpec,{
                customCss: '.swagger-ui .topbar { display: none }',
                customSiteTitle: "a4baz API", 
            })
            resolve(true)
        }
        catch(error){reject(error)}
    })
}
//***********************************************
Swagger.maker= (data)=>{
    let comment = `
 /** 
 * @swagger
 * ${data.url}:
 *  ${data.method}:
 *      summary : ${data.summary}
 *      description: ${data.description}
 *      parameters:$`
for (let index = 0; index < data.parameters.length; index++) {
    const parameter = data.parameters[index];
    comment +=`
 *  
 *        - in : "path"
 *          name : ${parameter.name}
 *          required: ${parameter.required}
 *          description : ${parameter.description}
 *          schema :
 *              type: ${parameter.type}
 * 
`
}

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
    `
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