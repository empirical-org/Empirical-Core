import { PartialResponse } from '../../interfaces';
export declare function spacyPOSSentenceMatch(response: string, question_uid: string, link: string): Promise<any>;
export declare function spacyPOSSentenceChecker(responseString: string, question_uid: string, link: string, matcherFunction?: Function): Promise<PartialResponse | undefined>;
export declare function spacyPOSSentenceResponseBuilder(match: any): PartialResponse;
