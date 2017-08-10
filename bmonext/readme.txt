resource link: https://developer.amazon.com/blogs/alexa/post/Tx24Z2QZP5RRTG1/new-alexa-technical-tutorial-debugging-aws-lambda-code-locally

Steps to create a locally debugable Alexa/Lambda Node JS application
1. Make sure nodejs is installed  - https://nodejs.org/en/download/
2. Make sure AWS cli is installed - https://docs.aws.amazon.com/cli/latest/userguide/installing.html
3. Create a new project directory
4. Create src, test and speechAssets folders in project directory
5. Install alexa-sdk in src directory - npm install --save alexa-sdk
6. Install aws-sdk in test directory - npm install --save aws-sdk
7. main.js, input.json, context.json into test directory, code in gitbub: https://s3.amazonaws.com/debug-blog/debug-files.zip
8. Setup AWS Role (currently already setup for user "alexa", accesskey and access-secret is in the accessKey-alexa.csv under the project root, step 8.1 -8.8 for setting up new user,
to use existing user "alexa", run step 8.9 only)
    8.1: Create a user Role in AWS IAM to be used in Alexa/Lambda execution: eg: myLambdaTestingRole
    8.2: Add a policy to the IAM user that allows it to assume execution roles at runtime  (CloudWatchFullAccess, AmazonDynamoDBFullAccess)
    8.3: Create a new user in AWS IAM to be used in Alexa/Lambda local execution: eg alexaDev
    8.4: Download and save accessKey and secret key (this will be used to configure the AWS cli )
    8.5: Copy User ARN value
    8.7: Paste ARN value into the Alex/Lambda excute role through edit Trust Relationship  under Principal "AWS":"{Role ARN}",
    8.8: Copy Role ARN and paste in test/main.js at beginning.
    8.9: configure AWS use newly created AccessID and Secret Access Key
        open terminal window
        >aws configure
        AWS Access Key ID [****************6XNQ]: {copy & paste access-key from the csv file here}
        AWS Secret Access Key [****************+LXp]: {{copy & paste secret-key from the csv file here}
        Default region name [us-east-1]:
        Default output format [json]:

9. Create the Alexa Skill, copy the application Id to input.json

    





