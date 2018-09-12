import Levenshtein from 'levenshtein';
import { Response } from 'quill-marking-logic'

export function getStatusForResponse(response = {}) {
  if (!response.feedback) {
    return 4;
  } else if (response.parent_id) {
    return (response.optimal ? 2 : 3);
  }
  return (response.optimal ? 0 : 1);
}

export default function responsesWithStatus(responses = {}) {
  return Object.keys(responses).map(key => {
    const value = responses[key]
    const statusCode = getStatusForResponse(value);
    return Object.assign({}, value, { statusCode, });
  });
}

export function sortByLevenshteinAndOptimal(userString: string, responses: Array<Response>) {
  responses.forEach((res) => { res.levenshtein = new Levenshtein(res.text, userString).distance; });
  return responses.sort((a, b) => {
    if ((a.levenshtein - b.levenshtein) != 0) {
      return a.levenshtein - b.levenshtein;
    }
      // sorts by boolean
      // from http://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property
    return (a.optimal === b.optimal) ? 0 : a.optimal ? -1 : 1;
  });
}
