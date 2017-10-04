'use strict';
const jsonQuery = require('json-query')
const data = require('./data.js');

module.exports = {
  commutinggroceries_amount_text(parameterscontextout,requestBody){
    
    let not_required_transportation=jsonQuery('result.contexts.[*].name', {
        data: requestBody
    }).value.indexOf("not_required_transportation");

    let not_required_grocery=jsonQuery('result.contexts.[*].name', {
        data: requestBody
    }).value.indexOf("not_required_groceries");



    let groceries_cost=this.get_groceries_cost(requestBody) || 0;
    let transportation_cost=this.get_transportation_cost(requestBody) || 0;

    let amount=groceries_cost+transportation_cost;
    if(not_required_grocery!=-1 && not_required_transportation!=-1){
      parameterscontextout["commutinggroceries_amount_text"]="As you can see that takes your total minimum expense to ‎£"+amount+"."
    }
    else{
      parameterscontextout["commutinggroceries_amount_text"]="I've added ‎£"+amount+" to your expenses"
    }
  
  },

  //sync request (even it is implemented with promises)
  get_source_at(uri){
      var source;
        let request = require('request');
      request({ uri:uri}, function (error, response, body) {
          source = body;
      });
      while(source === undefined) {
        require('deasync').runLoopOnce();
      }
      return source;
  },
// return parameteres 
  get_parameters(requestBody){
    return jsonQuery('result.contexts[name=datakeeper]', {
          data: requestBody
      }).value.parameters
  },

//return the relevant area data
  get_area_data(requestBody){
    let area_to_stay=this.get_parameters(requestBody).area_to_stay;
    let area_data=jsonQuery('body[Name_of_area='+area_to_stay+']', {
        data: data.area_data
    }).value;
    return area_data;
  },
// calculate transportation cost
  get_transportation_cost(requestBody){
    
    let transportationType=this.get_parameters(requestBody).TransportationType;
    if(transportationType!=undefined){
        transportationType=transportationType[0];
    }

    let area_data=this.get_area_data(requestBody);

    let transportation_cost=undefined;
    if(transportationType=="bike"){
        transportation_cost=area_data.Cost_of_bike;
    }
    if(transportationType=="walk"){
        transportation_cost=area_data.Cost_of_walk;
    }
    if(transportationType=="public_transport"){
        transportation_cost=area_data.Cost_of_tube;
    }

    return transportation_cost;
  },
// calculation of grocceries cost
  get_groceries_cost(requestBody){
    
    let grocerries_cost=data.grocerries_cost;
    let timesAWeek=this.get_parameters(requestBody).TimesAWeek;

    let grocerry_cost=undefined;
    if(timesAWeek==0){
        grocerry_cost=data.grocerries_cost._0days;
    }
    if(timesAWeek==1){
        grocerry_cost=data.grocerries_cost._1days;
    }
    if(timesAWeek==3){
        grocerry_cost=data.grocerries_cost._3days;
    }
    if(timesAWeek==5){
        grocerry_cost=data.grocerries_cost._5days;
    }
    if(timesAWeek==7){
        grocerry_cost=data.grocerries_cost._7days;
    }

    return grocerry_cost;
  },
// calculation of rent cost
  get_rent_cost(requestBody){
    let flattype_to_stay=this.get_parameters(requestBody).flattype_to_stay;
    
    let area_to_stay=this.get_parameters(requestBody).area_to_stay;
    let area_data=jsonQuery('body[Name_of_area='+area_to_stay+']', {
        data: data.area_data
    }).value;
    
    let rent=area_data.Non_SI_1_bed_rent;
    
    if(flattype_to_stay=="room"){
        rent=area_data.Non_SI_room_rent;
    }
    return rent;
  },
// get data for original country
  get_original_country_data(requestBody){
        // examples of query context
    let original_city=this.get_parameters(requestBody).original_city;
     // use API (sync request) to get country for the original city

    let res=this.get_source_at('http://gd.geobytes.com/AutoCompleteCity?callback=?&q='+original_city)

    let countries=JSON.parse(res.substr(2).slice(0, -2));

    let country="";

    // check that country is not United State or Canada and country was not assign yet
    countries.forEach(function(element) {
        if(!element.includes("United States")){
            if(!element.includes("Canada")){
                if(country==""){
                    // extract just the country from the response
                    country=element.split(',')[element.split(',').length-1].substr(1);
                }
            }
        }
    })
        
    // get comperision data for this country
    let country_data=jsonQuery('body[Country='+country+']', {
        data: data.country_data
    }).value;

    return country_data;
  },

  //basechat
    intent_analytics(requestBody,speech){
        this.analytics(
            requestBody.sessionId,
            requestBody.result.resolvedQuery,
            requestBody.id,
            "me",
            requestBody.result.action,
            requestBody.timestamp
        );
        this.analytics(
            requestBody.sessionId,
            speech,
            undefined,
            "agent",
            requestBody.result.action,
            requestBody.timestamp);
    },
  
    analytics(sessionId,message,messageId,type,intent,timestamp){

        let chatbase = require('@google/chatbase');
        
        let msg = chatbase.newMessage('2f56a676-4165-469e-a60f-8e48de8f129c')
        // WARNING: setTimestamp() should only be called with a Unix Epoch with MS precision
        .setTimestamp(Date.now().toString()) // Only unix epochs with Millisecond precision
        .setPlatform('Web-with-infographics') // sets the platform to the given value
        .setMessage(message) // the message sent by either user or agent
    //    .setAsFeedback() // sets the message as feedback from the user
    //    .setAsNotFeedback() // sets the message as a regular message -- this is the default
        .setUserId(sessionId) // a unique string identifying the user which the bot is interacting with
        .setVersion('1.0'); // the version that the deployed bot is
        // if it is agent or person
        if(type!=messageId){
            msg
            .setMessageId(messageId); // the id of the message, this is optional
        }

        if(type=="me"){
            msg
            .setIntent(intent) // the intent of the sent message (does not have to be set for agent messages)
            .setAsTypeUser();    
        }
        else{
            msg
            .setAsTypeAgent();    
        }

        // if it is Handle or not
        if(intent.includes("fallback")){
            msg
            .setAsNotHandled();    
        }
        else{
            msg
            .setAsHandled();    
        }

        msg
        .send()
        .catch(err => 
            console.error("error chatbase"+ err)
        );

    }

};


