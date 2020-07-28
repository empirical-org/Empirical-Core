export interface Lesson {
    flag: string,
    introURL?: string,
    isELL?: boolean,
    landingPageHtml: string,
    modelConceptUID?: string,
    name: string,
    questions: {
      key: string,
      questionType: string
    }[]
}