export interface Match {
  isExact: boolean;
  path: string;
  url: string;
  params: Param;
}

export interface Param {
  conceptFeedbackID?: string;
  questionID?: string;
  conceptID?: string;
  lessonID?: string;
}
