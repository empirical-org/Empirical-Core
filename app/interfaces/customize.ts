import * as CLIntF from './classroomLessons'

export interface EditionMetadata {
  key: string,
  last_published_at: number,
  lesson_id: string,
  name: string,
  sample_question: string,
  user_id: number,
  flags?: Array<string>,
  lessonName?: string
}

export interface EditionQuestions {
  questions: CLIntF.Questions
}

export interface EditionsMetadata {
  [key:string]: EditionMetadata;
}
