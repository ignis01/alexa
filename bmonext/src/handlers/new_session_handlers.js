const welcomeGreeting = 'Welcome to B. M. O. Next. How can I help you? Say Foreign Exchange for F. X. rate information. '+
        'Say Bank Account for our day to day banking information. Say Credit Card for our credit card information. '+
        'Say Branch for our Branch Location Search. Say I have a Question to access to our Frequently Asked Questions ';
const goodbyeResponse = 'Thank for using B. M. O. next, Goodbye!';

var states = require('../state').states;
module.exports.newSessionHandlers = {
    'NewSession': function() {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeGreeting);
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