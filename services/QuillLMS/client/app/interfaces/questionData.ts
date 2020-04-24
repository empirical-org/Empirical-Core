import Concept from "./concept";

export interface QuestionData {
    directions: string,
    prompt: string,
    answer: string,
    score: number,
    concepts: Concept[],
    question_number: number
}
