import { Response, FocusPoint, PartialResponse } from '../../interfaces';
export declare function focusPointMatchHelper(responseString: string, focusPointParticle: string): boolean;
export declare function focusPointMatch(responseString: string, focusPoints: Array<FocusPoint>): FocusPoint;
export declare function focusPointChecker(responseString: string, focusPoints: Array<FocusPoint>, responses: Array<Response>): PartialResponse | undefined;
export declare function focusPointResponseBuilder(focusPointMatch: FocusPoint, responses: Array<Response>): PartialResponse;
