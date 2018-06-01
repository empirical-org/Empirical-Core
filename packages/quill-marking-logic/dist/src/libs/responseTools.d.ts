/// <reference types="underscore" />
import * as _ from 'underscore';
import { Response, PartialResponse } from '../interfaces';
export interface ResponseObject {
    [key: string]: Response;
}
export interface ResponseWithLevenshtein extends Response {
    levenshtein?: Number;
}
export declare function getStatusForResponse(response?: PartialResponse): Number;
export default function responsesWithStatus(responses?: ResponseObject): _.Dictionary<Response & {
    statusCode: Number;
}>;
export declare function sortByLevenshteinAndOptimal(userString: string, responses: Array<ResponseWithLevenshtein>): Array<Response>;
