export interface Question {
    conceptID: string,
    cues: Array<string>,
    cuesLabel: string,
    flag?: string,
    instructions: string,
    itemLevel: string,
    key: string,
    prefilledText: string,
    prompt: string
}