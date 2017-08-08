const helpGreeting = 'Welcome to B.M.O. Next. How can I help you? Say Foreign Exchange for FX rate information. '+
        'Say Bank Account for our day to day banking information. Say Credit Card for our credit card information. '+
        'Say Branch for our Branch Location Search. Say I have a Question to access to our Frequently Asked Questions ';
const goodbyeResponse = 'Thank for using B. M. O. next, Goodbye!';

var states = require('../state').states;
module.exports.newSessionHandlers = {
    'LaunchRequest': function() {
        this.handler.state = states.STARTMODE;
        this.emit(':askWithCard', "Welcome to BMO Next, how can I help you?", "Are you there? What can I do for you? ", "Welcome", "Welcome to BMO Next, you can " +
            "say 'Exchange rate' for Foreign Exchange Information, say 'find me a branch' to locate a branch or ATM close by",null );
    },

    'AMAZON.HelpIntent': function() {
            this.handler.state = states.STARTMODE;
            this.emit(':ask', helpGreeting);
        },

    "AMAZON.StopIntent": function() {
          this.emit(':tell', goodbyeResponse);
        },

    "AMAZON.CancelIntent": function() {
          this.emit(':tell', goodbyeResponse);
    },

    'SessionEndedRequest': function () {
            console.log('session ended!');
            this.emit(":tell", goodbyeResponse);
    }
}