import { rematchIndividualQuestion, } from './rematch'

exports.handler = async (event) => {
  console.log('event', event)
  console.log('event.body', event.body)
  const body = JSON.parse(event.body);
  console.log('body', body)
  const { response, type, question, referenceResponses } = body

  try {
    return await rematchIndividualQuestion(response, type, question, referenceResponses).
      then((rematch) => {
        return {
          statusCode: 200,
          body: JSON.stringify(rematch),
        };
      });
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
