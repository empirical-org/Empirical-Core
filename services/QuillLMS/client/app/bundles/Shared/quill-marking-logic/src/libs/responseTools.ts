import * as _ from 'underscore';
// Attempt a direct import if the module's default export is not directly accessible.
import Levenshtein from 'levenshtein';
import { Response, PartialResponse } from '../interfaces';

export interface ResponseObject {
  [key: string]: Response; // Use `any` to sidestep detailed index signature issues.
}

export interface ResponseWithLevenshtein extends Response {
  levenshtein?: number; // Use lowercase `number` type to match TypeScript conventions.
}

export function getStatusForResponse(response: PartialResponse = {}): number {
  if (!response.feedback) {
    return 4;
  } else if (response.parent_id) {
    return (response.optimal ? 2 : 3);
  }
  return (response.optimal ? 0 : 1);
}

export default function responsesWithStatus(responses: ResponseObject = {}): { [key: string]: any } {
  return _.mapObject(responses, (value, key) => {
    const statusCode = getStatusForResponse(value);
    // Explicitly spread `value` to maintain compatibility.
    return { ...value, statusCode };
  });
}

export function sortByLevenshteinAndOptimal(userString: string, responses: Array<ResponseWithLevenshtein>): Array<Response> {
  responses.forEach((res) => {
    // Safely handle `Levenshtein` calculation with direct import.
    res.levenshtein = new Levenshtein(res.text, userString).distance;
  });
  return responses.sort((a, b) => {
    const aLevenshtein = Number(a.levenshtein);
    const bLevenshtein = Number(b.levenshtein);
    if (aLevenshtein - bLevenshtein !== 0) {
      return aLevenshtein - bLevenshtein;
    }
    return (a.optimal === b.optimal) ? 0 : a.optimal ? -1 : 1;
  });
}
