import { Response, IncorrectSequence, FocusPoint } from '../../interfaces';
export declare function checkSentenceCombining(question_uid: string, response: string, responses: Array<Response>, focusPoints: Array<FocusPoint> | null, incorrectSequences: Array<IncorrectSequence> | null): Response;
