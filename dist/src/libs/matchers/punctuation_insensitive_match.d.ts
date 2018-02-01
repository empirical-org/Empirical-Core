import { Response, PartialResponse } from '../../interfaces';
export declare function punctuationInsensitiveMatch(responseString: string, responses: Array<Response>): Response | undefined;
export declare function punctuationInsensitiveChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function punctuationInsensitiveResponseBuilder(responses: Array<Response>, parentID: string | number): PartialResponse;
