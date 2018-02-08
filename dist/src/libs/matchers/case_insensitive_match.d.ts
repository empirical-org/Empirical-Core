import { Response, PartialResponse, ConceptResult } from '../../interfaces';
export declare function caseInsensitiveMatch(response: string, responses: Array<Response>): Response | undefined;
export declare function caseInsensitiveChecker(responseString: string, responses: Array<Response>, passConceptResults?: Boolean): PartialResponse | undefined;
export declare function caseInsensitiveResponseBuilder(responses: Array<Response>, parentID: string | number, conceptResults?: Array<ConceptResult>): PartialResponse;
