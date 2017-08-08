var Alexa = require("alexa-sdk");
var states = require('../state').states;
var fxRateHandler = require('../handlers/fx_rate_handlers');
const goodbyeResponse = 'Thank for using B. M. O. next, Goodbye!';

module.exports.startMenuHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
     'FXRateIntent': function () {
        "use strict";
        this.handler.state = states.FXMODE;
        fxRateHandler.fxRateHandlers.FXRateIntent.apply(this);
     },

    'FAQIntent': function () {
        "use strict";
        this.handler.state = states.FAQMODE;
        this.emit(':ask', 'What type of questions do you want to ask? ', 'What type of questions do you want to ask? ');
    },

    'BankAccountIntent': function () {
        "use strict";
        this.handler.state = states.BANKACCMODE;
        this.emit(':ask', 'What type of accounts are you interested in? ', 'What type of accounts are you interested in? ');
    },

    'CreditCardIntent': function () {
        "use strict";
        this.handler.state = states.CREDITCARDMODE;
        this.emit(':ask', 'What type of Credit Card are you interested in? ', 'What type of Credit Card are you interested in? ');
    },

    'LocationIntent': function () {
        "use strict";
        this.handler.state = states.LOCATIONMODE;
        this.emit(':ask', 'Do you want to search by Postal Code or major interception? ', 'Do you want to search by Postal Code or major interception? ');
    },

    "AMAZON.StopIntent": function () {
        this.emit(':tell', goodbyeResponse);
    },

    "AMAZON.CancelIntent": function () {
        this.emit(':tell', goodbyeResponse);
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", goodbyeResponse);
    },
    'Unhandled': function () {
        console.log("UNHANDLED");
        this.emit(":ask", "I don't understand your request, please Say Help for assistance or Start Over to retry");
    }


});
