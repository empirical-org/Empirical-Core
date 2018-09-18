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
  metadata: ConceptResultMetadata,
  concept_uid: string,
  question_type: "passage-proofreader"
}

export interface ConceptResultMetadata {
  answer: string,
  correct: 0|1,
  instructions: string,
  prompt: string,
  questionNumber: number,
  unchanged: boolean,
}
