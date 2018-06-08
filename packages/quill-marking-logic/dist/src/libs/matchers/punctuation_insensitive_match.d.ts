import { Response, PartialResponse, ConceptResult } from '../../interfaces';
export declare function punctuationInsensitiveMatch(responseString: string, responses: Array<Response>): Response | undefined;
export declare function punctuationInsensitiveChecker(responseString: string, responses: Array<Response>, passConceptResults?: Boolean): PartialResponse | undefined;
export declare function punctuationInsensitiveResponseBuilder(responses: Array<Response>, parentID: string | number, conceptResults?: Array<ConceptResult>): PartialResponse;
