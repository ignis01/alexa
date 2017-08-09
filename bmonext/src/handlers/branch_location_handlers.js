var Alexa = require('alexa-sdk');
var http = require('http');
var https = require('https');

var states = require('../state').states;
var constantResp = require('../handlers/constant');
var helpResponse = "This is the help message for FAQ";

module.exports.branchHandlers = Alexa.CreateStateHandler(states.LOCATIONMODE, {
    "BranchLocationIntent": function () {

        var speechOutput = constantResp.notImplementedResponse;
        this.handler.state = states.STARTMODE;
        this.emit(':ask', speechOutput, speechOutput);
    },


    "AMAZON.StopIntent": function () {
        this.emit(':tell', constantResp.goodbyeResponse);
    },

    "AMAZON.CancelIntent": function () {
        this.emit(':tell', constantResp.goodbyeResponse);
    },

    "AMAZON.HelpIntent": function () {
        this.emit(':tell', helpResponse);
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", constantResp.goodbyeResponse);
    },
    'Unhandled': function () {
        console.log("UNHANDLED");
        this.emit(":ask", constantResp.errorResponse);
    }
})
