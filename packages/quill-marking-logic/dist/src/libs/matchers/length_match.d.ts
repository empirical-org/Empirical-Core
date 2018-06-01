import { Response, PartialResponse, WordCountChange } from '../../interfaces';
export interface LengthMatch {
    feedback: string;
    author: string;
}
export declare function lengthMatch(response: string, responses: Array<Response>, prompt: string, wordCountChange?: WordCountChange): LengthMatch | undefined;
export declare function lengthChecker(responseString: string, responses: Array<Response>, prompt: string, wordCountChange?: Object): PartialResponse | undefined;
export declare function lengthResponseBuilder(responses: Array<Response>, parentID: string | number, author: string, feedback: string): PartialResponse;
export declare function wordLengthCount(str: any): any;
export declare function getMinMaxFeedback(min: any, max: any): string;
