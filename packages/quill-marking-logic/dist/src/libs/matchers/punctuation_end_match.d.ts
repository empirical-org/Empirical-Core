import { Response, PartialResponse } from '../../interfaces';
export declare function punctuationEndMatch(responseString: string, responses: Array<Response>): Boolean;
export declare function punctuationEndChecker(responseString: string, responses: Array<Response>, markOptimalFalse?: Boolean): PartialResponse | undefined;
export declare function punctuationEndResponseBuilder(responses: Array<Response>, markOptimalFalse: Boolean): PartialResponse;
