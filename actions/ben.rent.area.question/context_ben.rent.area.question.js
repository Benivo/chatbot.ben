'use strict';

const data = require('../../data.js');
const jsonQuery = require('json-query')
const apiai = require("apiai");


module.exports = {
  processor:function(parameterscontextout,requestBody)
  {
    // examples of potential context
    //parameterscontextout["something"]="something";

    // examples of query context
    //let from_city_food_cost=jsonQuery('rent[**].cities[name='+parameterscontextout["from_city"]+' ]', {
    //    data: data
    //}).value.food_cost;
    infographics.infographic_2(parameterscontextout,requestBody);
    SetAreaEntityValues(requestBody.sessionId,[]);

    return parameterscontextout; 
  } 

  
}

// set variable values for user session in api ai
var SetAreaEntityValues=function(sessionId,neighborhoods){

    var app = apiai("b266cf849ba2485a96dcdcee069f60d2");

    var sessionId = sessionId;

    var user_entities = [{
        name: 'Area',
        extend: false,
        entries: [
        ]
    }];

//    neighborhoods.forEach(function(neighborhood){
//        user_entities[0].entries.push({value:neighborhood.name,synonyms:[neighborhood.name]});
//    })

    user_entities[0].entries.push({value:"Bank",synonyms:["Bank"]});

    var user_entities_body = {
        sessionId: sessionId,
        entities: user_entities
    };

/*    var user_entities_request = app.userEntitiesRequest(user_entities_body);

    user_entities_request.on('response', function(response) {
        console.log('User entities response: ' +JSON.stringify(response, null, 4));
    });

    user_entities_request.on('error', function(error) {
        console.error(error);
    });

    user_entities_request.end();*/
}



