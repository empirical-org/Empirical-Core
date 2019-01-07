const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  const { uid, type } = event

  const lambda = new AWS.Lambda()
  lambda.invoke({
      FunctionName: 'rematch_lambda',
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
  }, function(err,data) {
    console.log('invoked the rematch lambda')
    if (err) {
      callback(err)
    } else {
      const response = {
          statusCode: 200,
          body: JSON.stringify(`uid: ${uid}, type: ${type}`),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
      };
      callback(null, response)
    }
  });
};
