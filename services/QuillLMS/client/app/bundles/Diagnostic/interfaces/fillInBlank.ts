export interface FillInBlank {
    blankAllowed?: boolean,
    conceptID: string,
    cues: Array<string>,
    cuesLabel: string,
    flag?: string,
    instructions: string,
    prompt: string
}