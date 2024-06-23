import { rematchIndividualQuestion, } from './rematch'

//
// exports.handler = async (event) => {
//   const body = JSON.parse(event.body);
//   const { response, type, question, referenceResponses } = body

//   try {
//     return await rematchIndividualQuestion(response, type, question, referenceResponses).
//       then((rematch) => {
//         return {
//           statusCode: 200,
//           body: JSON.stringify(rematch),
//         };
//       });
//   } catch(err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(err),
//     };
//   }
// };



var src_default = {
  async fetch(request, env, ctx) {

    const body = JSON.parse(request.body);
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



  }
};

export {
  src_default as default
};