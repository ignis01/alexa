var Alexa = require("alexa-sdk");
var http = require('http');
var https = require('https');

var states = require('../state').states;
const goodbyeResponse = 'Thank for using B. M. O. Next, Goodbye!';

module.exports.fxRateHandlers = Alexa.CreateStateHandler(states.FXMODE, {
    "FXRateIntent": function () {
        var filledSlots = delegateSlotCollection(this).call(this);
        var currency = this.event.request.intent.slots.Currency.value;
        var buyOrSell = this.event.request.intent.slots.BuyOrSell.value;
        var amount = this.event.request.intent.slots.Amount.value;
        var fxRatesObj = '';

        if (!this.attributes.fxrates) {
            var endpoint = "http://ec2-54-219-137-161.us-west-1.compute.amazonaws.com/fxrates";
            var body = "";
            console.log('request sending to ' + endpoint);
            http.get(endpoint, (response) => {
                console.log('request sending...');
                response.on('data', (chunk) => {
                    body += chunk;
                });
                response.on('end', () => {
                    console.log("response is " + body);
                    fxRatesObj = JSON.parse(body);
                    this.attributes.fxrates = JSON.stringify(fxRatesObj);
                    var speechOutput = calculate(currency, buyOrSell, amount, fxRatesObj);
                    this.emit(':tell', speechOutput);
                });
            }).on('error', function (e) {
                console.log('Data retrieval error ' + e.message);
                return "Foreign Exchange rate is not available right now. Please try again later";
            });
        } else {
            fxRatesObj = JSON.parse(this.attributes.fxrates);
            var speechOutput = calculate(currency, buyOrSell, amount, fxRatesObj);
            this.emit(':tell', speechOutput);
        }
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


function calculate(currency, action, amount, rates) {
    var outputResponse = "The " + currency + " exchange rate is not available.";
    //first check if the currency is valid
    for (i = 0; i < rates.length; i++) {
        console.log(rates[i].countryName.toLowerCase() + "-" + currency);
        if (rates[i].countryName.toLowerCase() === currency.toLowerCase() ||
            rates[i].currencyName.toLowerCase() === currency.toLowerCase() ||
            rates[i].currencySymbol.toLowerCase() === currency.toLowerCase()) {
            if (action.toLowerCase() === "buy") {
                rate = parseFloat(rates[i].buyRate);
                total = (amount * rate).toFixed(2);
                outputResponse = "The buy rate for " + currency + " is " + rates[i].buyRate + ". We buy " + amount + " " + currency + " for " + total + " Canadian Dollars. ";
                console.log(outputResponse);
                return outputResponse;
            } else {
                rate = parseFloat(rates[i].sellRate);
                total = (amount * rate).toFixed(2);
                outputResponse = "The sell rate for " + currency + " is " + rates[i].sellRate + ". We sell " + amount + " " + currency + " for " + total + " Canadian Dollars. ";
                console.log(outputResponse);
                return outputResponse;
            }
            break;
        }
    }
    return outputResponse;
}

function delegateSlotCollection(obj) {
    "use strict";
    console.log("in delegateSlotCollection");
    console.log("current dialogState: " + obj.event.request.dialogState);
    if (obj.event.request.dialogState !== "COMPLETED") {
        console.log("incompleted");
        obj.emit(":delegate", obj.event.request.intent);
    } else {
        console.log("in completed");
        console.log("returning: " + JSON.stringify(obj.event.request.intent));
        return obj.event.request.intent;
    }
}