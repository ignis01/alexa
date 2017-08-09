var states = require('../state').states;
var constantResponse = require('../handlers/constant');

module.exports.newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':askWithCard', "Welcome to BMO Next, how can I help you?", "Are you there? What can I do for you? ", "Welcome", "Welcome to BMO Next, you can " +
            "say 'Exchange rate' for Foreign Exchange Information, say 'find me a branch' to locate a branch or ATM close by", null);
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', constantResponse.helpGreeting);
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
}