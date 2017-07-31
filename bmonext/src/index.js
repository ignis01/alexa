'use strict';
var Alexa = require("alexa-sdk");
var appId = 'amzn1.ask.skill.513d467a-513b-4465-a555-4bbc63c23b92';

var newSessionHandlers = require('./handlers/new_session_handlers.js').newSessionHandlers;
var faqHandlers = require('./handlers/faq_handlers').faqHandlers;
var fxRateHandlers = require('./handlers/fx_rate_handlers').fxRateHandlers;
var bankAccountInfoHandlers = require('./handlers/bank_account_handlers').bankAcountInfoHandlers;
var creditCardInfoHandlers = require('./handlers/credit_card_handlers').creditCardInfoHandlers;
var branchLocationHandlers = require('./handlers/branch_location_handlers').branchLocationHandlers;
var startMenuHandlers = require('./handlers/start_menu_handlers').startMenuHandlers;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    //alexa.dynamoDBTableName = ''; to connects dynamo db
    alexa.registerHandlers(newSessionHandlers, startMenuHandlers, faqHandlers, fxRateHandlers, bankAccountInfoHandlers, creditCardInfoHandlers, branchLocationHandlers);
    alexa.execute();
};

