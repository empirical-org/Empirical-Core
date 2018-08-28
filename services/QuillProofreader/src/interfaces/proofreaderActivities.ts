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
