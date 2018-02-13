import { Response, PartialResponse } from '../../interfaces';
export declare function machineLearningSentenceMatch(response: string, link: string): Promise<boolean>;
export declare function machineLearningSentenceChecker(responseString: string, responses: Array<Response>, link: string, matcherFunction?: Function): Promise<PartialResponse | undefined>;
export declare function machineLearningSentenceResponseBuilder(responses: Array<Response>, matched: Boolean): PartialResponse;
