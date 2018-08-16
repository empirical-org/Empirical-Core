import { Response, PartialResponse } from '../../interfaces';
export declare function partsOfSpeechMatch(response: string, responses: Array<Response>): PartialResponse | undefined;
export declare function partsOfSpeechChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function partsOfSpeechResponseBuilder(responses: Array<Response>, match: any): PartialResponse;
export declare function getGradedResponses(responses: Array<Response>): Response[];
