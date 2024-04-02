import { Concept } from "./concept";
import { KeyTargetSkillConcept } from './keyTargetSkillConcept'

export interface QuestionData {
    directions: string,
    prompt: string,
    answer: string,
    score: number,
    concepts: Concept[],
    question_number: number,
    key_target_skill_concept: KeyTargetSkillConcept
}
