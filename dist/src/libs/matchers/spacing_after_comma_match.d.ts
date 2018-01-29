import { Response, PartialResponse } from '../../interfaces';
export declare function spacingAfterCommaMatch(response: any): Boolean;
export declare function spacingAfterCommaChecker(responseString: string, responses: Array<Response>): PartialResponse | undefined;
export declare function spacingAfterCommaResponseBuilder(responses: Array<Response>): PartialResponse;
