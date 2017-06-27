export interface ClassroomLessonSession {
  students: Students;
  presence: Presence;
  questions: Questions;
  current_slide: string;
  modes: Modes;
  submissions: Submissions;
  selected_submissions: SelectedSubmissions;
}

export interface ClassroomLessonSessions {
 [sessionUID:string]: ClassroomLessonSession
}


export interface Students {
 [key:string]: string
}

export interface Presence {
 [key:string]: boolean
}

export interface Questions {
  [key:string]: Question
}

export interface QuestionData {
  play: PlayData
  teach: TeachData
}

export interface Question {
  type: string;
  data: QuestionData;
}

export interface ScriptItem {
  type: string;
  text?: string;
}

export interface TeachData {
  script: Array<ScriptItem>
}

export interface PlayData {
 [key:string]: any
}

export interface Modes {
 [key:string]: string
}

export interface Submissions {
 [key:string]: QuestionSubmissionsList
}

export interface QuestionSubmissionsList {
  [key:string]: QuestionSubmission
}

export interface QuestionSubmission {
  timeSubmitted: number;
  submission: any
}

export interface SelectedSubmissions {
  [key:string]: SubmissionsForQuestion
}

export interface SubmissionsForQuestion {
 [key:string]: boolean
}
