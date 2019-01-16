const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = (event, context, callback) => {
  const { uid, type } = event

  function finishRematching() {
    console.log('rematching succeeded')
    const response = 'Rematching succeeded';
    callback(null, JSON.stringify(response))
  }

  if (uid) {
    rematchIndividualQuestion(uid, type, finishRematching)
  } else {
    rematchAllQuestionsOfAType(type, finishRematching)
  }
};
