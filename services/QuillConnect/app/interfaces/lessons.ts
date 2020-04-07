export interface Lessons{
  [key: string]: Lesson
}

export interface QuestionReference {
  key: string;
  questionType: string;
}

export interface Lesson {
  flag: string;
  introURL: string;
  name: string;
  questions: Array<QuestionReference>;
}
