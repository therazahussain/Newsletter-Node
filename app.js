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
    const url = MAILCHIMP_API_KEY
    const options = {
        method: 'POST',
        auth: MAILCHIMP_AUTHENTICATION_KEY
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

