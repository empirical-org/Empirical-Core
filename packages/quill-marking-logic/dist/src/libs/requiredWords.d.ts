import { Response, FeedbackObject } from '../interfaces/index';
export declare function getCommonWords(sentences: Array<string>): Array<string>;
export declare function getCommonWordsWithImportantPOS(sentences: Array<string>): Array<string>;
export declare function getMissingWords(userString: string, sentences: Array<string>): Array<string>;
export declare function getFeedbackForWord(word: string, sentences: Array<string>, isSentenceFragment: Boolean): string;
export declare function extractSentencesFromResponses(responses: Array<Response>): Array<string>;
export declare function getMissingWordsFromResponses(userString: string, sentences: Array<string>): Array<string>;
export declare function checkForMissingWords(userString: string, responses: Array<Response>, isSentenceFragment?: boolean): FeedbackObject;
