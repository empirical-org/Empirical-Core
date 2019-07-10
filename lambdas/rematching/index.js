const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = (event, context, callback) => {
  const { response, type, question, referenceResponses } = event

  function finishRematching(result) {
    callback(null, result)
  }

  rematchIndividualQuestion(response, type, question, referenceResponses, finishRematching)
};
