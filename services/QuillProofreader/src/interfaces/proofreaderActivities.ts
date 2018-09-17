export interface ProofreaderActivities {
  [key:string]: ProofreaderActivity;
}

export interface ProofreaderActivity {
  description: string;
  title: string;
  passage: string;
  standard: Standard;
  standardLevel: StandardLevel;
  topicCategory: TopicCategory;
  underlineErrorsInProofreader: boolean;
}

export interface Standard {
  name: string;
  uid: string;
}

export interface StandardLevel {
  name: string;
  uid: string;
}

export interface TopicCategory {
  name: string;
  uid: string;
}

export interface ConceptResultObject {
  answer: string,
  correct: 0|1,
  instructions: string,
  prompt: string,
  questionNumber: number,
  unchanged: boolean,
  conceptUID: string
}
