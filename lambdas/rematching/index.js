const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = (event, context, callback) => {
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
    rematchIndividualQuestion(uid, type, finishRematching)
  } else {
    rematchAllQuestionsOfAType(type, finishRematching)
  }
};
