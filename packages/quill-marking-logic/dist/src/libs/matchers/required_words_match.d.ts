import { Response, FeedbackObject, PartialResponse } from '../../interfaces';
export declare function requiredWordsMatch(responseString: string, responses: Array<Response>): FeedbackObject;
export declare function requiredWordsChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function requiredWordsResponseBuilder(responses: Array<Response>, feedback: string): PartialResponse;
