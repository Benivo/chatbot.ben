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
    let original_country_data=context_common.get_original_country_data(requestBody);
    parameterscontextout["user_language_Hello"]=original_country_data.Hello;
    parameterscontextout["user_language_Goodbye"]=original_country_data.Goodbye;
    parameterscontextout["user_language_Great"]=original_country_data.Great;
    
    parameterscontextout["original_capital"]=context_common.get_area_data(requestBody).Capital_cities;

    infographics.infographic_1(parameterscontextout,requestBody);

    

    return parameterscontextout; 
  } 
}


