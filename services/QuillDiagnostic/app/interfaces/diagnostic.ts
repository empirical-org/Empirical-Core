export interface Diagnostic {
    flag: string,
    isELL?: boolean,
    landingPageHtml: string,
    name: string,
    questions: {
        key: string,
        questionType: string
    }[]
}