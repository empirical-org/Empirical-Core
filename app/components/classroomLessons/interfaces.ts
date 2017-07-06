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

// should not have text field
// once dummy data structure is updated
export interface ScriptItem {
  type: string;
  text?: any;
  data: ScriptText;
}

export interface ScriptText {
  heading: string;
  body: any;
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
  timestamp: string;
  data: any
}

export interface SelectedSubmissions {
  [key:string]: SelectedSubmissionsForQuestion
}

export interface SelectedSubmissionsForQuestion {
 [key:string]: boolean
}
