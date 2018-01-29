import { Response } from '../interfaces';
export declare function getOptimalResponses(responses: Array<Response>): Array<Response>;
export declare function getSubOptimalResponses(responses: Array<Response>): Array<Response>;
export declare function getTopOptimalResponse(responses: Array<Response>): Response;
export declare function getPercentageWeakResponses(responses: Array<Response>): string;
export declare function getGradedResponses(responses: Array<Response>): Array<Response>;
