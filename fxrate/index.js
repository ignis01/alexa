/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
// or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.

// TODO add URL to this entry in the cookbook


 // 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function

 var speechOutput;
 var reprompt;
 var welcomeOutput = "Welcome to BMO Foreign Exchange Rate Service. Which currency are you interested in?";
 var welcomeReprompt = "Do you want to buy or sell?";
 //var welcomeReprompt2 = "For what amount?";
 var rateIntro = [
   " I hope you satisfied with my answer. ",
   " Ask me another one if you like! "
 ];



 // 2. Skill Code =======================================================================================================

'use strict';
var https = require('https');
var http = require('http');
var sessionAttributes={}
var Alexa = require('alexa-sdk');
var APP_ID = "BMOFXRate";  // TODO replace with your app ID (OPTIONAL).

var handlers = {
    'LaunchRequest': function () {
        //get rate from web service
            var endpoint = "http://ec2-54-67-36-85.us-west-1.compute.amazonaws.com/fxrates";
            var body = "";
            console.log('request sending to '+ endpoint);
            http.get(endpoint, (response)=>{
            console.log('request sending...');
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end',()=>{
               console.log("response is "+ body);
               this.attributes['rates'] = JSON.stringify(JSON.parse(body));    
               this.emit(':ask', welcomeOutput, welcomeReprompt);
            });
            }).on('error', function(e){
               this.emit(":tell", "Something is not working right " + e.message);
            });    
        
     
    },
    'GetFxRate': function () {
        //delegate to Alexa to collect all the required slot values
        
        
        var filledSlots = delegateSlotCollection.call(this);
        var speechOutput="";
        //compose speechOutput that simply reads all the collected slot values
        //var speechOutput = randomPhrase(rateIntro);

        //activity is optional so we'll add it to the output
        //only when we have a valid activity
        /*var travelMode = isSlotValid(this.event.request, "travelMode");
        if (travelMode) {
          speechOutput += travelMode;
        } else {
          speechOutput += "You'll go ";
        }*/

        //Now let's recap the trip
        var currency=this.event.request.intent.slots.toCurrency.value;
        var action=this.event.request.intent.slots.action.value;
        var amount=this.event.request.intent.slots.amount.value;
        if(amount===null){
          amount = 1.00;
        }
        console.log("User is looking for "+ action + " "+ amount + " "+currency);
        rates = JSON.parse(this.attributes['rates']);
        //console.log(rates);
        speechOutput = calculate(currency, action, parseFloat(amount), rates);
        console.log(speechOutput);
        speechOutput += randomPhrase(rateIntro);

        /*var activity = isSlotValid(this.event.request, "activity");
        if (activity) {
          speechOutput += " to go "+ activity;
        }*/

        //say the results
        this.emit(":tell",speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.emit(':tell', speechOutput);
    },

    'Unhandled': function () {
        this.emit(':ask','Sorry I didnt understand that. Say help for assistance.');
    }
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}

function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

function calculate(currency, action, amount, rates){
    var outputResponse = "The " + currency + " exchange rate is not available.";
    //first check if the currency is valid
    for(i=0;i<rates.length;i++){
       console.log(rates[i].countryName.toLowerCase() + "-" + currency);
        if(rates[i].countryName.toLowerCase() === currency||
           rates[i].currencyName.toLowerCase() === currency||
           rates[i].currencySymbol.toLowerCase() === currency){
             if(action ==="buy"){
                 rate = parseFloat(rates[i].buyRate);
                 total = (amount * rate).toFixed(2);
                 outputResponse = "The buy rate for "+ currency + " is "+ rates[i].buyRate + ". We buy " + amount + " "+ currency +" for " + total + " Canadian Dollars. ";
                 console.log(outputResponse);
                 return outputResponse;
             }else{
                 rate = parseFloat(rates[i].sellRate);
                 total = (amount * rate).toFixed(2);
                 outputResponse = "The sell rate for "+ currency + " is "+ rates[i].sellRate + ". We sell " + amount + " "+ currency +" for " + total + " Canadian Dollars. ";
                 console.log(outputResponse);
                 return outputResponse;
             }  
        break;       
    }
    return outputResponse; 
  }
}
