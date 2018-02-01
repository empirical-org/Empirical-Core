import { Response, PartialResponse } from '../../interfaces';
export declare function whitespaceMatch(response: string, responses: Array<Response>): Response | undefined;
export declare function whitespaceChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function whitespaceResponseBuilder(responses: Array<Response>, parent_id: string | number): PartialResponse;
