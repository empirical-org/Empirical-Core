import { Response, PartialResponse } from '../../interfaces';
export interface TextChangesObject {
    missingText: string | null;
    extraneousText: string | null;
}
export interface ChangeObjectMatch {
    errorType?: string;
    response: Response;
    missingText: string | null;
    extraneousText: string | null;
}
export declare function rigidChangeObjectChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function flexibleChangeObjectChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function rigidChangeObjectMatchResponseBuilder(match: ChangeObjectMatch): PartialResponse | null;
export declare function flexibleChangeObjectMatchResponseBuilder(match: ChangeObjectMatch): PartialResponse | null;
export declare function rigidChangeObjectMatch(response: string, responses: Array<Response>): ChangeObjectMatch;
export declare function flexibleChangeObjectMatch(response: string, responses: Array<Response>): ChangeObjectMatch;
export declare function checkChangeObjectMatch(userString: string, responses: Array<Response>, stringManipulationFn: (string: string) => string, skipSort?: boolean): ChangeObjectMatch | null;
