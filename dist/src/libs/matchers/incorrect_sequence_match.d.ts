import { Response, IncorrectSequence, PartialResponse } from '../../interfaces';
export declare function incorrectSequenceMatch(responseString: string, incorrectSequences: Array<IncorrectSequence>): IncorrectSequence;
export declare function incorrectSequenceChecker(responseString: string, incorrectSequences: Array<IncorrectSequence>, responses: Array<Response>): PartialResponse | undefined;
export declare function incorrectSequenceResponseBuilder(incorrectSequenceMatch: IncorrectSequence, responses: Array<Response>): PartialResponse;
