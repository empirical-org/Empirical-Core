import { Response, IncorrectSequence } from '../../interfaces';
export declare function checkSentenceFragment(hash: {
    question_uid: string;
    response: string;
    responses: Array<Response>;
    wordCountChange?: Object;
    ignoreCaseAndPunc?: Boolean;
    incorrectSequences?: Array<IncorrectSequence>;
    prompt: string;
    checkML?: Boolean;
    mlUrl?: string;
}): Promise<Response>;
