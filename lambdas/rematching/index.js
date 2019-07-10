const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = (event, context, callback) => {
  const { response, type, question, referenceResponses } = event

  function finishRematching(result) {
    callback(null, result)
  }

  try {
    rematchIndividualQuestion(response, type, question, referenceResponses, finishRematching)
  } catch(err) {
    callback(err);
  }
};
