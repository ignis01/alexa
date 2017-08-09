var Alexa = require("alexa-sdk");
var http = require('http');
var https = require('https');
var startHandler = require('../handlers/start_menu_handlers');

var states = require('../state').states;
const goodbyeResponse = 'Thank for using B. M. O. Next, Goodbye!';
const tryAnotherResponse = "What else can I help you with?" ;

module.exports.fxRateHandlers = Alexa.CreateStateHandler(states.FXMODE, {
    "FXRateIntent": function () {
         //console.log(JSON.stringify(this.event, null, 4));
          var intentObj = this.event.request.intent;
          if(!intentObj.slots.Currency.value){
                var slotToElicit = 'Currency';
                var speechOutput = 'What currency are you interested in?';
                var repromptSpeech = speechOutput;
                this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech, intentObj);
          }else if(!intentObj.slots.BuyOrSell.value){
                var slotToElicit = 'BuyOrSell';
                var speechOutput = 'Do you want to buy or sell?';
                var repromptSpeech = speechOutput;
                this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech, intentObj);
          }else if(!intentObj.slots.Amount.value){
                var slotToElicit = 'Amount';
                var speechOutput = 'How much do you like to exchange?';
                var repromptSpeech = speechOutput;
                this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech,intentObj);
          }else {
                var currency = intentObj.slots.Currency.value;
                var buyOrSell = intentObj.slots.BuyOrSell.value;
                var amount = intentObj.slots.Amount.value;

                  var fxRatesObj = '';

                    if(!this.attributes.fxrates) {
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
                                var reprompt =  tryAnotherResponse;
                                var speechOutput = calculate(currency, buyOrSell, amount, fxRatesObj) + reprompt;
                                this.handler.state= states.STARTMODE;
                                this.emit(':ask',speechOutput,reprompt);
                            });
                        }).on('error', function (e) {
                            console.log('Data retrieval error ' + e.message);
                            return "Foreign Exchange rate is not available right now. "+ tryAnotherResponse;
                        });
                    }else{
                        fxRatesObj = JSON.parse(this.attributes.fxrates);
                        var reprompt =  " What else can I help you with?"
                        var speechOutput = calculate(currency, buyOrSell, amount, fxRatesObj) + reprompt;
                        this.handler.state = states.STARTMODE;
                        this.emit(':ask',speechOutput, reprompt);
                    }
         }
    },

   /* "AMAZON.YesIntent":function () {
        console.log("enter yes intent");
        this.emit(':elicitSlot', 'Currency', 'What currency are you interested in? ', 'What currency are you interested in? ', "FxRateIntent" );
    },

    "AMAZON.YesIntent":function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask','Ok, what else can I help you with?');
    },*/

    "AMAZON.StopIntent": function() {
          this.emit(':tell', goodbyeResponse);
    },

    "AMAZON.CancelIntent": function() {
          this.emit(':tell', goodbyeResponse);
    },

    'SessionEndedRequest': function () {
          console.log('session ended!');
          this.emit(":tell", goodbyeResponse);
    },
    'Unhandled': function() {
          console.log("UNHANDLED");
          this.emit(":ask", "I don't understand your request, please Say Help for assistance or Start Over to retry");
    }
});


function calculate(currency, action, amount, rates){
    var outputResponse = "The " + currency + " exchange rate is not available.";
    //first check if the currency is valid
    for(i=0;i<rates.length;i++) {
        console.log(rates[i].countryName.toLowerCase() + "-" + currency);
        if (rates[i].countryName.toLowerCase() === currency.toLowerCase() ||
            rates[i].currencyName.toLowerCase() === currency.toLowerCase() ||
            rates[i].currencySymbol.toLowerCase() === currency.toLowerCase()) {
            if (action.toLowerCase() === "buy") {
                rate = parseFloat(rates[i].buyRate);
                total = (amount * rate).toFixed(2);
                outputResponse = "The buy rate for " + rates[i].currencyName.toLowerCase()+ " is " + rates[i].buyRate + ". We buy " + amount + " " + rates[i].currencyName.toLowerCase() + " for " + total + " Canadian Dollars. ";
                console.log(outputResponse);
                return outputResponse;
            } else {
                rate = parseFloat(rates[i].sellRate);
                total = (amount * rate).toFixed(2);
                outputResponse = "The sell rate for " + rates[i].currencyName.toLowerCase() + " is " + rates[i].sellRate + ". We sell " + amount + " " + rates[i].currencyName.toLowerCase() + " for " + total + " Canadian Dollars. ";
                console.log(outputResponse);
                return outputResponse;
            }
            break;
        }
    }
    return outputResponse;
}

module.exports.calculate = calculate;