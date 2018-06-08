import { Response, PartialResponse } from '../../interfaces';
export declare function caseStartMatch(responseString: string, responses: Array<Response>): Boolean;
export declare function caseStartChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function caseStartResponseBuilder(responses: Array<Response>): PartialResponse;
