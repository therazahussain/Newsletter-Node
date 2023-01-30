const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})


app.post("/", function(req, res){
    const fname = req.body.firstName; 
    const lname = req.body.lastName; 
    const email = req.body.email; 

    const data = {
        members : [
            {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: fname,
                LNAME: lname
                }    
            }
        ]
    };

    const jsonData = JSON.stringify(data)
    const url = "https://us14.api.mailchimp.com/3.0/lists/522249c7c2"
    const options = {
        method: 'POST',
        auth: "Raza:b8fb7ed655db3bdcbafa66bd845752ee-us14"
    }


    const request = https.request(url,options,function(response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }


        response.on('data', function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})


app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Port Started!");
})

