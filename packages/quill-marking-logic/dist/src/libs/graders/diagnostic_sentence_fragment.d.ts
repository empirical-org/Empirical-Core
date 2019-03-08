import { Response, IncorrectSequence, FocusPoint } from '../../interfaces';
export declare function checkDiagnosticSentenceFragment(hash: {
    question_uid: string;
    response: string;
    responses: Array<Response>;
    wordCountChange?: Object;
    ignoreCaseAndPunc?: Boolean;
    incorrectSequences?: Array<IncorrectSequence>;
    focusPoints?: Array<FocusPoint>;
    prompt: string;
    checkML?: Boolean;
    mlUrl?: string;
    defaultConceptUID?: string;
}): Promise<Response>;
