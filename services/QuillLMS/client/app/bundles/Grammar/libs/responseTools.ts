import Levenshtein from 'levenshtein';
import { Response } from 'quill-marking-logic'

type ResponseWithLevenshtein = Response & { levenshtein: any }

export function getStatusForResponse(response: Response|{} = {}) {
  if (response.optimal === null && !response.parent_id && !response.author) {
    return 4;
  } else if (response.parent_id || response.author) {
    return (response.optimal ? 2 : 3);
  }
  return (response.optimal ? 0 : 1);
}

export default function responsesWithStatus(responses: {[key: string]: Response}|{} = {}) {
  const responsesWithStatus: {[key: string]: Response} = {}
  Object.keys(responses).forEach(key => {
    const value = responses[key]
    const statusCode = getStatusForResponse(value);
    responsesWithStatus[key] = Object.assign({}, value, { statusCode, });
  });
  return responsesWithStatus
}

export function sortByLevenshteinAndOptimal(userString: string, responses: ResponseWithLevenshtein[]) {
  responses.forEach((res) => { res.levenshtein = new Levenshtein(res.text, userString).distance; });
  return responses.sort((a, b) => {
    if ((a.levenshtein - b.levenshtein) !== 0) {
      return a.levenshtein - b.levenshtein;
    }
    // sorts by boolean
    // from http://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property
    return (a.optimal === b.optimal) ? 0 : a.optimal ? -1 : 1;
  });
}
