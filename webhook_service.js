'use strict';
const data = require('./data.js');
var format = require("string-template")

module.exports = {

response:function (requestBody) {
    // return value
    var retVal={};
    
    // build the context based on contextout
    var parameterscontextout={};
    for(var key in requestBody.result.parameters) {
        parameterscontextout[key] = requestBody.result.parameters[key];
    }

    if (requestBody.result.contexts) {
        requestBody.result.contexts.forEach(function(context) {
            if(context.name=="datakeeper"){
                for(var key in context.parameters) {
                    parameterscontextout[key] = context.parameters[key];
                }
            }
        });
    }
    // process the webhook request
    retVal=logic_proccessor(requestBody,parameterscontextout);
    
    return retVal;    
}


};

var logic_proccessor=function(requestBody,parameterscontextout){
    
    // default value for speach
    var speech = '';
 //   parameterscontextout["_debug_requestBody"]=JSON.stringify(requestBody);
    
    //store the action in context
    parameterscontextout["action"]=requestBody.result.action;
    parameterscontextout["log_id"]=requestBody.sessionId+" "+ requestBody.id +" ==>> ";
    //set next event to fire to empty (not to fire)
    parameterscontextout["fire_event"]="";
    //set next infographics to no infographics
    parameterscontextout["Infographics"]={};

    // set the distination city and the original city
    parameterscontextout["distination_city"]="London";
    parameterscontextout["your_company"]="Goppa";
    parameterscontextout["user_name"]="John";
    

    console.log(parameterscontextout["log_id"]+"action "+requestBody.result.action);
    console.log(parameterscontextout["log_id"]+"resolvedQuery "+requestBody.result.resolvedQuery);
    
    console.log(parameterscontextout["log_id"]+"requestBody "+JSON.stringify(requestBody));
    // if neccesary excute business rules and store results in context 
    try
    {
        parameterscontextout=getContext(requestBody.result.action,parameterscontextout,requestBody);
    }
    catch(err){
        console.error(parameterscontextout["log_id"]+"error run logic for intent "+err);
        console.error(parameterscontextout["log_id"]+"error run logic for intent "+ requestBody);
    }
    
    // get the template
    let template=getTemplate(requestBody.result.action);
    // build the speech to the user
    speech = getSpeech(template, parameterscontextout);

    const context_common = require('./context.common.js');
    context_common.intent_analytics(requestBody,speech);

    let retval={
        speech: speech,
        displayText: speech,
        data:parameterscontextout,
        source: 'apiai-webhook-sample',
        contextOut: [{"name":"datakeeper", "lifespan":100, "parameters":parameterscontextout}]
    };
    console.log(parameterscontextout["log_id"]+"speech " +speech);
    console.log(parameterscontextout["log_id"]+"event " +parameterscontextout["fire_event"]);
    console.log(parameterscontextout["log_id"]+"response " +JSON.stringify(retval));

    // return object that works for api ai
    return retval;

}

// formating speech based template and content
var getSpeech=function(template, parameterscontextout){
    let speech=format(template, parameterscontextout);
    return speech;
}

// excute business rules for action
var getContext=function(action,parameterscontextout,requestBody){
    let context=require('./actions/'+action+'/context_'+action).processor(parameterscontextout,requestBody);
    return context;
}

// get the template
var getTemplate=function(action){
    let template=require('fs').readFileSync('./actions/'+action+'/template_'+action+'.txt', 'utf8');
    return template;
}

