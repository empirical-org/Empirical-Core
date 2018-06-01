import { Response, PartialResponse, ConceptResult } from '../../interfaces';
export declare function punctuationAndCaseInsensitiveMatch(responseString: string, responses: Array<Response>): Response | undefined;
export declare function removePunctuation(string: any): any;
export declare function punctuationAndCaseInsensitiveChecker(responseString: string, responses: Array<Response>, passConceptResults?: Boolean): PartialResponse | undefined;
export declare function punctuationAndCaseInsensitiveResponseBuilder(responses: Array<Response>, parentID: string | number, conceptResults?: Array<ConceptResult>): PartialResponse;
