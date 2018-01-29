import { FeedbackObject, PartialResponse, Response } from '../../interfaces';
export declare function spacingBeforePunctuationMatch(responseString: string): FeedbackObject | undefined;
export declare function spacingBeforePunctuationChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function spacingBeforePunctuationResponseBuilder(responses: Array<Response>, feedback: string): PartialResponse;
