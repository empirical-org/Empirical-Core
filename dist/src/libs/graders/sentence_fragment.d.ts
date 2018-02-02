import { Response, IncorrectSequence } from '../../interfaces';
export declare function checkSentenceFragment(question_uid: string, response: string, responses: Array<Response>, wordCountChange: Object, ignoreCaseAndPunc: Boolean, incorrectSequences: Array<IncorrectSequence>, prompt: string): Response;
