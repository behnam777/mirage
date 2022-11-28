[
    {
        "url":"/signup",
        "method":"post",
        "service":"signup",
        "summary":"user and expert",
        "description":"first step for join out system",
        "parameters":[ 
                {"name":"authorization","location":"header","type":"string"}
        ],
        "body":{
            "type":"application/json", 
            "required":true,
            "description":"login",
            "data":{ 
                "phonenumber":"0912..."
            }
        },
        "responses":{
            "type":"application/json", 
            "required":true,
            "description":"login",
            "data":{ 
                "status":"String",
                "state":"Boolean",
                "message":"String",
                "data":"Null"
            }
        } ,
        "header":{
            "name":"authentication", 
            "type":"string", 
            "required":true
        }
    } 
]