var https =require('https');
var http = require('http');
var sessionAttributes={};

exports.handler = (event, context, callback) => {
     if(event.session.new){
        //New Session
        console.log("NEW SESSION");
    }
    try{
    sessionAttributes = event.session.attributes;
    var rates = "";
    switch(event.request.type){
     case "LaunchRequest":
            console.log('LAUNCH REQUEST');
            var endpoint = "http://ec2-54-67-36-85.us-west-1.compute.amazonaws.com:8081/fxrates";
            var body = "";
            console.log('request sending to '+ endpoint);
            http.get(endpoint, (response)=>{
            console.log('request sending...');
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end',()=>{
               console.log("response is "+ body);
              sessionAttributes = {"rates":JSON.stringify(JSON.parse(body))}    
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to BMO Foreign Exchange Rate Service, to inquire about specific currency, " +
                                    " just say the country name or the currency name, for example, say United States or U.S. Dollars for " +
                                    " U.S. Dollar to Canadian Dollar exchange rate. You can also say All Rates, to get the full list of the exchange rates.  ", false),sessionAttributes
                  )
            );
            });
        }).on('error', function(e){
            callback(new Error(e.message));
        });
        
           break;
           
           case "IntentRequest":
            console.log('INTENT REQUEST');
            console.log(event.request.intent.name);
            console.log("rates in session "+ sessionAttributes.rates);
            var responseString="";
            rates = JSON.parse(sessionAttributes.rates);
            
            if(event.request.intent.name == "endSession"){
                 console.log('End Session REQUEST');
                    context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Thank You for using BMO Foreign Exchange Rate Service ", true),{}
                    )
                );
                break;
            }
            if(event.request.intent.name == "getAllRates"){
                var currencyType =[];
                for(i=0;i<rates.length;i++){
                    //avoid duplicated currency
                    if(currencyType.indexOf(rates[i].currencyName)<0){
                    responseString += "For One "+ rates[i].currencyName + " to Canadian Dollar, We buy at " + rates[i].buyRate + ", We sell at " + rates[i].sellRate + ". ";  
                    currencyType.push(rates[i].currencyName);
                    }
                }
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse(responseString, false),sessionAttributes
                    )
                );
                break;
            }    
            
            if(event.request.intent.name == "getFxRate"){
                if(event.request.intent.slots.ToCurrency.value!==null){
                for(i=0;i<rates.length;i++){
                    var matchingString = event.request.intent.slots.ToCurrency.value.toLowerCase();
                    console.log (matchingString +"-"+ rates[i].currencySymbol.toLowerCase());
                    if(rates[i].countryName.toLowerCase() === matchingString||
                        rates[i].currencyName.toLowerCase() === matchingString||
                        rates[i].currencySymbol.toLowerCase() === matchingString){
                        responseString = "For one " + rates[i].currencyName + " to Canadian Dollar, we buy at "+ rates[i].buyRate + ", " +
                            "we sell at " + rates[i].sellRate + ".";
                        break;
                    }
                }
              }
              console.log(responseString);
              if(responseString.length===0){
                  responseString = "Exchange Rate for "+ event.request.intent.slots.ToCurrency.value +" is not available";
              }
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse(responseString, false),sessionAttributes
                    )
                );
                break;
            }
            break;
            

        case "SessionEndedRequest":
            console.log('End Session REQUEST');
            context.succeed(
                generateResponse(
                    buildSpeechletResponse("Thank You for using BMO FX Rate Service ", true),{}
                    
                    )
                );
            break;
            
        default:
           context.succeed(
                generateResponse(
                    buildSpeechletResponse("I am experiencing a bit of technical difficulties here, please try again later! Sorry for the inconvenience, bye!", true),{}
                    
                    )
                );
            break;
      
    
    }
    }
     catch(error){context.fail('Exception:'+ error)}
};

  buildSpeechletResponse = (outputText, shouldEndSession)=>{
        return{
            outputSpeech:{
                type: "PlainText",
                text: outputText
            },
            shouldEndSession: shouldEndSession
        };
    };

    generateResponse = (speechletResponse,sessionAttributes)=>{
        return {
            version: "1.0",
            sessionAttributes: sessionAttributes,
            response: speechletResponse
        };

    };
    
    function getFxRatesResp(callback){
        var endpoint = "http://ec2-54-67-36-85.us-west-1.compute.amazonaws.com:8081/fxrates";
        var body = "";
        console.log('request sending to '+ endpoint);
        http.get(endpoint, function (response){
            console.log('request sending...');
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end',function(){
               console.log("response is "+ body);
               callback(null, JSON.parse(body));
            });
        }).on('error', function(e){
            callback(new Error(e.message));
        });
    }