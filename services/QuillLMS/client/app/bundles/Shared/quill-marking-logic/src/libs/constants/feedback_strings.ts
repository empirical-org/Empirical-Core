import feedbackData from '../../../../../../../../config/locales/feedback_strings.json';

interface FeedbackStrings {
  [key: string]: string;
}

interface FeedbackData {
  feedbackStrings: FeedbackStrings;
  spellingFeedbackStrings: FeedbackStrings;
}

const { feedbackStrings, spellingFeedbackStrings } = feedbackData as FeedbackData;

export { feedbackStrings, spellingFeedbackStrings };
