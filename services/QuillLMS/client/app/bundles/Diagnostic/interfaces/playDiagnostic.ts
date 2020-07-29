interface Question {
    data: {
        conceptID: string,
        flag: string,
        instructions: string,
        isFragment: boolean
        needsIdentification: boolean
        optimalResponseText: string,
        prompt: string,
        responses: {
            feedback: string,
            optimal: boolean,
            text: string
        }[],
        key: string,
        attempts: []
    }
    type: string
}

interface QuestionData {
    data: {
        attempts: [],
        content: string,
        key: string,
        title: string
    },
    type: string
}

export interface PlayDiagnostic {
    answeredQuestions: Question[],
    currentQuestion: QuestionData,
    language: string,
    questionSet: QuestionData[],
    unansweredQuestions: Question[]
}