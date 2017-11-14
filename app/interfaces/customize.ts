import * as CLIntF from './classroomLessons'

export interface Edition {
  data: CLIntF.ClassroomLesson,
  key: string,
  last_published_at: number,
  lesson_id: string,
  name: string,
  sample_question: string,
  user_id: number,
  flags?: Array<string>,
}

export interface Editions {
  [key:string]: Edition;
}
