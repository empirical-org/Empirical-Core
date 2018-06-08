import { Response, PartialResponse } from '../../interfaces';
export declare function maxLengthMatch(responseString: string, responses: Array<Response>): Boolean;
export declare function maxLengthChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function maxLengthResponseBuilder(responses: Array<Response>): PartialResponse;
