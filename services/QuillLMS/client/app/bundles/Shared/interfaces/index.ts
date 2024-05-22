export interface UserIdsForEvent {
  studentId: number,
  teacherId: number
}

export interface NumberFilterInputProps {
  handleChange: Function;
  label: string;
  column: {
    filterValue: string;
    id: string;
  }
}

export interface Question {
  attempts?: Array<any>,
  blankAllowed?: boolean,
  caseInsensitive?: boolean,
  conceptID: string,
  cues: Array<string>,
  cuesLabel: string,
  flag?: string,
  instructions: string,
  key?: string,
  uid?: string
  prompt: string
}

export interface QuestionObject {
  attempts?: Array<any>,
  blankAllowed?: boolean,
  caseInsensitive?: boolean,
  conceptID: string,
  cues: Array<string>,
  cuesLabel: string,
  flag?: string,
  instructions: string,
  key?: string,
  uid?: string
  prompt: string
  question?: Question,
  data?: Question
}

export interface Activity {
  title?: string;
  name?: string;
  questions?: {
    key: string;
  }[];
  description?: string;
  landingPageHtml?: string;
  questionType?: string;
  flag?: string;
  modelConceptUID?: string;
}
