import { Response, PartialResponse } from '../../interfaces';
export declare function machineLearningSentenceMatch(response: string, link: string): Boolean;
export declare function machineLearningSentenceChecker(responseString: string, responses: Array<Response>, link: string): PartialResponse | undefined;
export declare function machineLearningSentenceResponseBuilder(responses: any, matched: Boolean): PartialResponse;
