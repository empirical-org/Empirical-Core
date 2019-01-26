import * as CLIntF from '../../interfaces/classroomLessons'

export type ClassroomSessionId = string

export type ClassroomUnitId = string

export type ClassroomLessonSession = {
  absentTeacherState: boolean
  classroom_name: string
  edition_id: string
  followUpOption: string
  followUpUrl: string
  id: string
  startTime: string
  student_ids: any
  supportingInfo: string
  teacher_ids: any
  teacher_name: string
  students: Students;
  presence: Presence;
  current_slide: string;
  modes: Modes;
  submissions: Submissions;
  selected_submissions: SelectedSubmissions;
  selected_submission_order: SelectedSubmissionOrder;
  timestamps: Timestamps;
  flaggedStudents: FlaggedStudents;
  public: Boolean | null;
  models: Models;
  prompts: Prompts;
  followUpActivityName: string | null;
  preview: Boolean | null
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

export interface FlaggedStudents {
  [key:string]: boolean
}

export interface Models {
  [key: string]: string
}

export interface Prompts {
  [key: string]: string
}

export interface ClassroomLessons {
  [key: string]: ClassroomLesson
}

export interface ClassroomLesson {
  title: string;
  lesson?: string|number;
  topic?: string;
  unit?: string;
  questions?: Questions;
  id?: string;
}

export interface Questions {
  [key: string]: Question
}

export interface Question {
  type: string;
  data: CLIntF.QuestionData;
}

export interface SelectedSubmissionOrder {
  [key:number]: Array<string>
}
