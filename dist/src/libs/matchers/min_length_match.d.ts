import { Response, PartialResponse } from '../../interfaces';
export declare function minLengthMatch(responseString: string, responses: Array<Response>): Boolean;
export declare function minLengthChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function minLengthResponseBuilder(responses: Array<Response>): PartialResponse;
