import { rematchAllQuestionsOfAType, rematchIndividualQuestion } from './rematch'

exports.handler = async (event) => {
  const { uid, type } = event
    if (uid) {
      rematchIndividualQuestion(uid, type)
    } else {
      rematchAllQuestionsOfAType(type)
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
