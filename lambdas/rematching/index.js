const { rematchAllQuestionsOfAType, rematchIndividualQuestion } =  require('./rematch')

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { response, type, question, referenceResponses } = body

  try {
    return await rematchIndividualQuestion(response, type, question, referenceResponses).
      then((rematch) => {
        console.log("rematch successful");
        console.log(rematch);
        console.log(typeof rematch);
        return {
          statusCode: 200,
          body: JSON.stringify(rematch),
        };
      });
  } catch(err) {
    console.log("rematch error");
    console.log(JSON.stringify(err));
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
