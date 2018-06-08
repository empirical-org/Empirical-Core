export declare function checkChangeObjectMatch(userString: string, responses: Array<Responses>, stringManipulationFn: (string: string) => string, skipSort?: boolean): {
    response: any;
    errorType: any;
} & {
    missingText: any;
    extraneousText: any;
};
