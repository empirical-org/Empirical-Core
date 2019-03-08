import { Response, IncorrectSequence, FocusPoint } from '../../interfaces';
export declare function checkGrammarQuestion(question_uid: string, response: string, responses: Array<Response>, focusPoints: Array<FocusPoint> | null, incorrectSequences: Array<IncorrectSequence> | null, defaultConceptUID: any): Response;
