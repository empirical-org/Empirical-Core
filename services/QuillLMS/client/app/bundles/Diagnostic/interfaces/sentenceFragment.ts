export interface SentenceFragment {
    conceptID: string,
    ignoreCaseAndPunc: boolean,
    instructions: string,
    isFragment: boolean,
    needsIdentification: boolean,
    optimalResponseText: string,
    prompt: string
}