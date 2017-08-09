'use strict';
var Alexa = require("alexa-sdk");
var appId = 'amzn1.ask.skill.5dff728e-c7ee-42d3-a506-2554a189f306';

var newSessionHandlers = require('./handlers/new_session_handlers.js').newSessionHandlers;
var faqHandlers = require('./handlers/faq_handlers.js').faqHandlers;
var fxRateHandlers = require('./handlers/fx_rate_handlers.js').fxRateHandlers;
var bankAccountInfoHandlers = require('./handlers/bank_account_handlers.js').accountHandlers;
var creditCardInfoHandlers = require('./handlers/credit_card_handlers.js').creditCardHandlers;
var branchLocationHandlers = require('./handlers/branch_location_handlers.js').branchHandlers;
var startMenuHandlers = require('./handlers/start_menu_handlers.js').startMenuHandlers;

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, 4));
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    //alexa.dynamoDBTableName = ''; to connects dynamo db
    alexa.registerHandlers(newSessionHandlers, startMenuHandlers, faqHandlers, fxRateHandlers, bankAccountInfoHandlers, creditCardInfoHandlers, branchLocationHandlers);
    alexa.execute();
};

