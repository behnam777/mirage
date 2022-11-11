const express = require("express");
const router = express.Router();
router.post('/login',(req, res) => { 
 try{
     (global.Functions["user"].addpost(req = req ,client =  res.locals.client ,) )
     .then(
         function(value) {res.send(value).status(value.status||200) },
         function(error) {res.send({status:false,message:"function internal error"}).status(value.status||500)}
      );
 }catch(err){res.send({status:false,message:"router internal error"}).status(500) }

  })
module.exports = router;
