import Concept from './concept.ts';

export interface Student {
    activity_classification: string,
    id: number,
    name: string,
    time: number,
    number_of_questions: number,
    number_of_correct_questions: number,
    concept_results: Concept[],
    score: number,
    average_score_on_quill: number,
    activity_session_id: number
}
