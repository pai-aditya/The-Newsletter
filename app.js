const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const serverless = require("serverless-http");

port  = 3000;

const app = express(); 
const router = express.Router();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/.netlify/functions/app',router);
module.exports.handler = serverless(app);

const https = require("https");
const json = require("body-parser/lib/types/json");

app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/html/index.html");
});

app.post("/",function(req,res){
    var FirstName = req.body.fName;
    var LastName = req.body.lName;
    var email = req.body.email;
    console.log({FirstName,LastName,email});

    const data = {
        members:[
             {
                  email_address: email,
                  status: "subscribed",
                  merge_fields:{
                       FNAME: FirstName,
                       LNAME: LastName
                  }
             }
        ]
   };
    const jasonData = JSON.stringify(data); 
    const url = "https://us21.api.mailchimp.com/3.0/lists/dc00c35904";         //us21 because our api key ends with us21 //note that we have entered our audience key
    const options = {
          method: "POST",
          auth: "paiaditya:2b66fd64bd19d9565340969ffd7aef21-us21" 
    }
    
    const request = https.request(url,options,function(response){

        if(response.statusCode==200){
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname+"/public/html/success.html");
        }
        else{
            // res.send("There was a error in signing up, please try again!")

            res.sendFile(__dirname+"/public/html/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

     request.write(jasonData);
     request.end();  


})
    
app.post("/public/html/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.port || 3000,function(){
    console.log("the server is up and running on port 3000");
});


// 056665facbdae615231b7d3afba43e0c-us21
// audience id = dc00c35904