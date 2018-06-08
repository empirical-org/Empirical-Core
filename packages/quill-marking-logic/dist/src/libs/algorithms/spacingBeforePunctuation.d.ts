import { FeedbackObject } from '../../interfaces';
export declare function getFeedbackForPunc(punc: string): string;
export declare function checkForSpacingError(userString: string): string;
export declare function spacingBeforePunctuation(userString: string): FeedbackObject | undefined;
