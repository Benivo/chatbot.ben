'use strict';
const infographics = require('../../infographics.js');
const context_common = require('../../context.common.js');

const data = require('../../data.js');
const jsonQuery = require('json-query')
const apiai = require("apiai");


module.exports = {
  processor:function(parameterscontextout,requestBody)
  {
    // set different languages 
    let original_country_data=context_common.get_original_country_data(requestBody,parameterscontextout);
    try{
      parameterscontextout["user_language_Hello"]=original_country_data.Hello;
      parameterscontextout["user_language_Goodbye"]=original_country_data.Goodbye;
      parameterscontextout["user_language_Great"]=original_country_data.Great;    
      parameterscontextout["original_capital"]=original_country_data.Capital_cities;    
      if(original_country_data.Capital_cities!=undefined){
        infographics.infographic_1(parameterscontextout,requestBody);
      }
    }
    catch(err){
      console.log(parameterscontextout["log_id"]+" no country parameters")
      parameterscontextout["user_language_Hello"]="Hello";
      parameterscontextout["user_language_Goodbye"]="Goodbye";
      parameterscontextout["user_language_Great"]="Great";    
    }

    

    return parameterscontextout; 
  } 
}


