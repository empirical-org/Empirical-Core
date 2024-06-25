import { rematchIndividualQuestion, } from './rematch'

var src_default = {
  async fetch(request, env, ctx) {

    const body = await request.json()
    const { response, type, question, referenceResponses } = body

    try {
      return await rematchIndividualQuestion(response, type, question, referenceResponses).
        then((rematch) => {
          return new Response(JSON.stringify({
            statusCode: 200,
            body: JSON.stringify(rematch),
          }))
        });
    } catch(err) {
      return new Response(JSON.stringify({
        statusCode: 500,
        body: JSON.stringify(err),
      }));
    }

  }
};

export {
  src_default as default
};
