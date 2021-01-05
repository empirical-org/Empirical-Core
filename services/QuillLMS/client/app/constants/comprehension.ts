// TODO: update to reflect the accurate option values

export const flagOptions = [
  {
    label: 'alpha',
    value: 'alpha'
  },
  {
    label: 'beta',
    value: 'beta'
  },
  {
    label: 'production',
    value: 'production'
  },
  {
    label: 'archived',
    value: 'archived'
  },
];

export const courseOptions = [
  {
    label: 'Word Generation',
    value: 'Word Generation'
  }
];

export const readingLevelOptions = [
  {
    label: '4th',
    value: 4
  },
  {
    label: '5th',
    value: 5
  },
  {
    label: '6th',
    value: 6
  },
  {
    label: '7th',
    value: 7
  },
  {
    label: '8th',
    value: 8
  },
  {
    label: '9th',
    value: 9
  },
  {
    label: '10th',
    value: 10
  },
  {
    label: '11th',
    value: 11
  },
  {
    label: '12th',
    value: 12
  },
];

export const BECAUSE = 'because';
export const BUT = 'but';
export const SO = 'so';
export const promptStems = [BECAUSE, BUT, SO];
export const DEFAULT_MAX_ATTEMPTS = 5;
export const FIRST = 'first';
export const SECOND = 'second';

export const PROMPT_ATTEMPTS_FEEDBACK_LABELS = {
  "1": {
    attemptLabel: '1st Attempt',
    feedbackLabel: '1st Feedback',
  },
  "2": {
    attemptLabel: '2nd Attempt',
    feedbackLabel: '2nd Feedback',
  },
  "3": {
    attemptLabel: '3rd Attempt',
    feedbackLabel: '3rd Feedback',
  },
  "4": {
    attemptLabel: '4th Attempt',
    feedbackLabel: '4th Feedback',
  },
  "5": {
    attemptLabel: '5th Attempt',
    feedbackLabel: '5th Feedback',
  }
}

export const PROMPT_HEADER_LABELS = {
  "because": 'Because Responses',
  "but": 'But Responses',
  "so": 'So Responses',
}

export const blankActivity = {
  title: '',
  // flag:'',
  scored_level: '',
  target_level: null,
  passage_attributes: [{ text: '' }],
  prompt_attributes: [
    {
      conjunction: 'because',
      text: '',
      max_attempts: 5,
      max_attempts_feedback: 'try again.',
      plagiarism_text: '',
      plagiarism_first_feedback: '',
      plagiarism_second_feedback: ''
    },
    {
      conjunction: 'but',
      text: '',
      max_attempts: 5,
      max_attempts_feedback: 'try again.',
      plagiarism_text: '',
      plagiarism_first_feedback: '',
      plagiarism_second_feedback: ''
    },
    {
      conjunction: 'so',
      text: '',
      max_attempts: 5,
      max_attempts_feedback: 'try again.',
      plagiarism_text: '',
      plagiarism_first_feedback: '',
      plagiarism_second_feedback: ''
    }
  ]
}

export const blankRuleSet = {
	name: '',
  feedback: '',
  priority: null,
	rules: [],
  prompts: []
}

export const TITLE = 'Title';
export const SCORED_READING_LEVEL = 'Scored reading level';
export const TARGET_READING_LEVEL = 'Target reading level';
export const PARENT_ACTIVITY_ID = 'Parent activity ID'
export const MAX_ATTEMPTS_FEEDBACK = 'Max attempts feedback';
export const PASSAGE = 'Passage';
export const BECAUSE_STEM = 'Because stem';
export const BECAUSE_PLAGIARISM_TEXT = 'Because plagiarism text';
export const BECAUSE_PLAGIARISM_PRIMARY_FEEDBACK = 'Because primary feedback';
export const BECAUSE_PLAGIARISM_SECONDARY_FEEDBACK = 'Because secondary feedback';
export const BUT_STEM = 'But stem';
export const BUT_PLAGIARISM_TEXT = 'But plagiarism text';
export const BUT_PLAGIARISM_PRIMARY_FEEDBACK = 'But primary feedback';
export const BUT_PLAGIARISM_SECONDARY_FEEDBACK = 'But secondary feedback';
export const SO_STEM = 'So stem';
export const SO_PLAGIARISM_TEXT = 'So plagiarism text';
export const SO_PLAGIARISM_PRIMARY_FEEDBACK = 'So primary feedback';
export const SO_PLAGIARISM_SECONDARY_FEEDBACK = 'So secondary feedback';

export const activityFormKeys = [
  TITLE,
  SCORED_READING_LEVEL,
  TARGET_READING_LEVEL,
  PARENT_ACTIVITY_ID,
  MAX_ATTEMPTS_FEEDBACK,
  PASSAGE,
  BECAUSE_STEM,
  BECAUSE_PLAGIARISM_TEXT,
  BECAUSE_PLAGIARISM_PRIMARY_FEEDBACK,
  BECAUSE_PLAGIARISM_SECONDARY_FEEDBACK,
  BUT_STEM,
  BUT_PLAGIARISM_TEXT,
  BUT_PLAGIARISM_PRIMARY_FEEDBACK,
  BUT_PLAGIARISM_SECONDARY_FEEDBACK,
  SO_STEM,
  SO_PLAGIARISM_TEXT,
  SO_PLAGIARISM_PRIMARY_FEEDBACK,
  SO_PLAGIARISM_SECONDARY_FEEDBACK,
];

export const MINIMUM_READING_LEVEL = 4;
export const MAXIMUM_READING_LEVEL = 12;
