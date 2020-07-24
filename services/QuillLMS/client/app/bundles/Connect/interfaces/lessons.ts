export interface Lessons{
  [key: string]: Lesson
}

export interface QuestionReference {
  key: string;
  questionType: string;
}

export interface Lesson {
  questionType: string;
  flag: string;
  introURL: string;
  name: string;
  questions: Array<QuestionReference>;
}

export interface LessonQuestion {
  key: string;
  questionType: string;
}
