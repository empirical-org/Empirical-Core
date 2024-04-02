import * as _ from 'underscore';
import * as Levenshtein_ from 'levenshtein';
const Levenshtein: any = (<any>Levenshtein_).default || Levenshtein_;
import {Response, PartialResponse} from '../interfaces'

export interface ResponseObject {
  [key:string]: Response,
}

export interface ResponseWithLevenshtein extends Response {
  levenshtein?: Number
}

export function getStatusForResponse(response:PartialResponse = {}):Number {
  if (!response.feedback) {
    return 4;
  } else if (response.parent_id) {
    return (response.optimal ? 2 : 3);
  }
  return (response.optimal ? 0 : 1);
}

export default function responsesWithStatus(responses:ResponseObject = {}) {
  return _.mapObject(responses, (value, key) => {
    const statusCode = getStatusForResponse(value);
    return Object.assign({}, value, { statusCode, });
  });
}

export function sortByLevenshteinAndOptimal(userString:string, responses:Array<ResponseWithLevenshtein>):Array<Response> {
  responses.forEach((res) => { res.levenshtein = new Levenshtein(res.text, userString).distance; });
  return responses.sort((a, b) => {
    const aLevenshtein = Number(a.levenshtein)
    const bLevenshtein = Number(b.levenshtein)
    if ((aLevenshtein - bLevenshtein) != 0) {
      return aLevenshtein - bLevenshtein;
    }
    // sorts by boolean
    // from http://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property
    return (a.optimal === b.optimal) ? 0 : a.optimal ? -1 : 1;
  });
}
