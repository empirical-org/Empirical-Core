export interface ClassroomLesson {
  title: string;
  lesson?: string|number;
  topic?: string;
  unit?: string;
  questions?: Questions;
  id?: string;
}

export interface Questions {
  [key:string]: Question
}

export interface Question {
  type: string;
  data: QuestionData;
}

export interface QuestionData {
  play: PlayData;
  teach: TeachData;
  reset?: Boolean;
}

export interface PlayData {
  topic?: string;
  [key:string]: any;
}

export interface TeachData {
  unit?: string;
  topic?: string;
  lesson?: number;
  title: string;
  script: Array<ScriptItem >
}

export interface ScriptItem {
  type: string;
  data?: ScriptText;
}

export interface ScriptText {
  heading?: string;
  body: any;
}
