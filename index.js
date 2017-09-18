'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const data = require('./data.js');
const webhook_service = require('./webhook_service.js');

const restService = express();


restService.use(bodyParser.json());
 
var webhook_processor=function (req, res) {


    console.log('hook request');

    try {
        return res.json( {
            speech: "we are here",
            displayText: "we are here",
            data:[],
            source: 'apiai-webhook-sample',
            contextOut: []
        });

        var response=webhook_service.response(req.body);
        console.log(response.speech);
        return res.json(response);

    } catch (err) {
            console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
}



restService.post('/hook',function(req,res) {
    return webhook_processor(req,res) 
});

restService.get('/hook',function(req,res) {
    var req = data.req; 
    return webhook_processor(req,res);

});







restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
    var env = process.env.NODE_ENV || 'dev';
    if(env=='dev'){
        // if dev envierment call to the test method
/*        const https = require('https');
        https.get('http//127.0.0.1:5000/hook', (resp) => {        
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });        */
    }
});

