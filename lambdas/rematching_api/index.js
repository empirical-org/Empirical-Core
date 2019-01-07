const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  const { uid, type } = event

  const lambda = new AWS.Lambda()
  lambda.invoke({
      FunctionName: 'rematch_lambda',
      InvocationType: 'Event',
      Payload: JSON.stringify(event, context, callback)
  }, function(err,data){});

  return JSON.stringify({
      statusCode: 200,
      body: JSON.stringify(`uid: ${uid}, type: ${type}`),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  });
};
