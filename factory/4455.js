
 /** 
 * @swagger
 * /signup:
 *  post:
 *      summary : user and expert
 *      description: first step for join out system
 *      parameters:
 *        - in : "path"
 *          name : "userID"
 *          required: false 
 *          schema :
 *              type: integer
 *      requestBody:
 *          requierd : true
 *          content:
 *              application/json:
 *                  schema:
 *                      name:
 *                        type: string
 *                      user:
 *                        type: object
 *                        properties:
 *                           id:
 *                              type: string 
 *                           psw:
 *                              type: string 
 *                      users:
 *                         type: array
 */