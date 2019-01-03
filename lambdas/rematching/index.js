const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { uid, type } = event

  function finishRematching() {
    const response = {
        statusCode: 200,
        body: JSON.stringify(`uid: ${uid}, type: ${type}`),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
    };
    callback(null, JSON.stringify(response))
  }

  if (uid) {
    return rematchIndividualQuestion(uid, type, finishRematching)
  } else {
    return rematchAllQuestionsOfAType(type, finishRematching)
  }
};
