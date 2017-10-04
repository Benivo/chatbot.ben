'use strict';

const data = require('../../data.js');
const jsonQuery = require('json-query')
const apiai = require("apiai");
const infographics = require('../../infographics.js');


module.exports = {
  processor:function(parameterscontextout,requestBody)
  {
    parameterscontextout["fire_event"]="rent_area_question";


    

    return parameterscontextout; 
  } 
}


