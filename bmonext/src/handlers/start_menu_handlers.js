var Alexa = require("alexa-sdk");
var states = require('../state').states;
var fxRateHandler = require('../handlers/fx_rate_handlers');
var faqHandler = require('../handlers/faq_handlers');
var creditCardHandler = require('../handlers/credit_card_handlers');
var accountHandler = require('../handlers/bank_account_handlers');
var branchHandler = require('../handlers/branch_location_handlers');
var constantResponse = require('../handlers/constant');


const goodbyeResponse = 'Thank for using B.M.O. next, Goodbye!';

module.exports.startMenuHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'FXRateIntent': function () {
        "use strict";
        this.handler.state = states.FXMODE;
        fxRateHandler.fxRateHandlers.FXRateIntent.apply(this);
    },

    'FAQIntent': function () {
        "use strict";
        this.handler.state = states.FAQMODE;
        faqHandler.faqHandlers.FAQIntent.apply(this);
    },

    'BankAccountInfoIntent': function () {
        "use strict";
        this.handler.state = states.BANKACCMODE;
        accountHandler.accountHandlers.BankAccountInfoIntent.apply(this);
    },

    'CreditCardInfoIntent': function () {
        "use strict";
        this.handler.state = states.CREDITCARDMODE;
        creditCardHandler.creditCardHandlers.CreditCardInfoIntent.apply(this);
    },

    'BranchLocationIntent': function () {
        "use strict";
        this.handler.state = states.LOCATIONMODE;
        branchHandler.branchHandlers.BranchLocationIntent.apply(this);
    },

    "AMAZON.StopIntent": function () {
        this.emit(':tell', constantResponse.goodbyeResponse);
    },

    "AMAZON.CancelIntent": function () {
        this.emit(':tell', constantResponse.goodbyeResponse);
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", constantResponse.goodbyeResponse);
    },
    'Unhandled': function () {
        console.log("UNHANDLED");
        this.emit(":ask", constantResponse.errorResponse);
    }


});
