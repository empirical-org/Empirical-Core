export interface ClassroomLessonSession {
  students: Students;
  presence: Presence;
  questions: Questions;
  current_slide: string;
  modes: Modes;
  submissions: Submissions;
  selected_submissions: SelectedSubmissions;
  timestamps: Timestamps
}

export interface ClassroomLessonSessions {
 [sessionUID:string]: ClassroomLessonSession
}


export interface Students {
 [key:string]: string
}

export interface TeacherAndClassroomName {
  teacher: string,
  classroom: string
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
  data?: ScriptText;
}

export interface ScriptText {
  heading?: string;
  body: any;
}

export interface TeachData {
  unit?: string;
  topic?: string;
  lesson?: number;
  title?: string;
  script: Array<ScriptItem>
}

export interface PlayData {
  topic?: string;
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

export interface Timestamps {
  [key:string]: string
}
