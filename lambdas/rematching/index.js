const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = async (event) => {
  const { uid, type } = event
    if (uid) {
      rematchIndividualQuestion(uid, type)
    } else {
      rematchAllQuestionsOfAType(type)
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('success'),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
    };
    return response;
};
