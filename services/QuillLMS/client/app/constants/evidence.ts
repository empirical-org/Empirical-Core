// TODO: update to reflect the accurate option values
export const BECAUSE = 'because';
export const BUT = 'but';
export const SO = 'so';
export const ALL = 'all';
export const promptStems = [BECAUSE, BUT, SO];
export const DEFAULT_MAX_ATTEMPTS = 5;
export const FIRST = 'first';
export const SECOND = 'second';
export const NONE = 'none';
export const PLAGIARISM = 'plagiarism';
export const SCORED =  'scored';
export const UNSCORED =  'unscored';
export const WEAK =  'weak';
export const COMPLETE =  'complete';
export const INCOMPLETE =  'incomplete';
export const STRONG =  'strong';
export const RULES_BASED_1 = 'rules-based-1';
export const RULES_BASED_2 = 'rules-based-2';
export const RULES_BASED_3 = 'rules-based-3';
export const LOW_CONFIDENCE = 'low-confidence';
export const SESSION_INDEX = 'sessionIndex';
export const RULES_ANALYSIS = 'rulesAnalysis';
export const RULE_ANALYSIS = 'ruleAnalysis';
export const ACTIVITY_STATS = 'activityStats';
export const GRAMMAR = 'grammar';
export const OPINION = 'opinion';
export const SPELLING = 'spelling';
export const AUTO_ML = 'autoML';
export const ACTIVE = 'active';
export const INACTIVE = 'inactive';
export const FEEDBACK = 'feedback'
export const HIGHLIGHT_TEXT = 'highlight text'
export const HIGHLIGHT_ADDITION = 'highlight addition'
export const HIGHLIGHT_REMOVAL = 'highlight removal'
export const HIGHLIGHT_TYPE = 'highlight type'
export const FEEDBACK_LAYER_ADDITION = 'feedback layer addition'
export const FEEDBACK_LAYER_REMOVAL = 'feedback layer removal'
export const BREAK_TAG = '<br/>';

export const TEXT = 'text';
export const FIRST_STRONG_EXAMPLE = 'first_strong_example';
export const SECOND_STRONG_EXAMPLE = 'second_strong_example';


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

export const ruleApiOrder = [RULES_BASED_1, OPINION, PLAGIARISM, LOW_CONFIDENCE, AUTO_ML, RULES_BASED_2, GRAMMAR,  SPELLING, RULES_BASED_3];

export const regexRuleTypes = ["rules-based-1", "rules-based-2", "rules-based-3"];

export const ruleTypeOptions = [
  {"value":"rules-based-1","label":"Sentence Structure Regex"},
  {"value":"rules-based-2","label":"Post-Topic Regex"},
  {"value":"rules-based-3","label":"Typo Regex"},
  {"value":"plagiarism","label":"Plagiarism"},
  {"value":"autoML","label":"AutoML"},
  {"value":LOW_CONFIDENCE,"label":"Low Confidence"}
];

export const universalRuleTypeOptions = [
  {"value":"grammar","label":"Grammar"},
  {"value":"opinion","label":"Opinion"},
  {"value":"spelling","label":"Spelling"},
  {"value":"prefilter","label":"Prefilter"}
];

export const ruleHighlightOptions = [
  {"value":"passage","label":"Passage"},
  {"value":"prompt","label":"Prompt"},
  {"value":"response","label":"Response"}
]

export const ruleOptimalOptions = [
  {"value":"optimal","label":"Optimal"},
  {"value":"","label":"Sub-Optimal"}
];

export const regexRuleSequenceOptions = [
  {"value":"incorrect","label":"Incorrect"},
  {"value":"required","label":"Required"}
];

export const activitySessionFilterOptions = [
  {"value":ALL,"label":"Show all sessions"},
  {"value":SCORED,"label":"Show only scored sessions"},
  {"value":UNSCORED,"label":"Show only unscored sessions"},
  {"value":WEAK,"label":"Show sessions with weak responses"},
  {"value":COMPLETE,"label":"Show complete sessions"},
  {"value":INCOMPLETE,"label":"Show incomplete sessions"}
];

export const RULE_TYPE_TO_ROUTE_PART = {
  autoML: 'semantic-labels',
  plagiarism: 'plagiarism-rules',
  'rules-based-1': 'regex-rules',
  'rules-based-2': 'regex-rules',
  'rules-based-3': 'regex-rules',
  'low-confidence': 'low-confidence-rules'
}

export const RULE_TYPE_TO_NAME = {
  autoML: 'Semantic',
  plagiarism: 'Plagiarism',
  'rules-based-1': 'Sentence Structure Regex',
  'rules-based-2': 'Post-topic Regex',
  'rules-based-3': 'Typo Regex',
  'low-confidence': 'Low Confidence'
}

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
  notes: '',
  scored_level: '',
  target_level: null,
  passage_attributes: [{ text: '' }],
  prompt_attributes: [
    {
      conjunction: 'because',
      text: '',
      max_attempts: 5,
      max_attempts_feedback: ''
    },
    {
      conjunction: 'but',
      text: '',
      max_attempts: 5,
      max_attempts_feedback: ''
    },
    {
      conjunction: 'so',
      text: '',
      max_attempts: 5,
      max_attempts_feedback: ''
    }
  ]
}

export const blankRule = {
  name: '',
  description: null,
  universal: false,
  rule_type: '',
  optimal: false,
  state: 'active',
  suborder: 0,
  concept_uid: 'Kr8PdUfXnU0L7RrGpY4uqg',
  prompt_ids: []
}

export const blankUniversalRule = {
  name: '',
  description: null,
  universal: true,
  rule_type: '',
  optimal: false,
  suborder: 0,
  state: 'active',
  concept_uid: 'Kr8PdUfXnU0L7RrGpY4uqg',
  feedbacks: [
    {
      text: '',
      order: 0,
      highlights_attributes: []
    }
  ]
}

export const DEFAULT_CONCEPT_UIDS = {
  because: 'qkjnIjFfXdTuKO7FgPzsIg', // Academic Writing | Using Evidence Appropriately | Using Precise Evidence to Illustrate a Cause
  but: 'KwspxuelfGZQCq7yX6ThPQ', // Academic Writing | Using Evidence Appropriately | Using Precise Evidence to Illustrate a Contrast
  so: 'IBdOFpAWi42LgfXvcz0scQ' // Academic Writing | Using Evidence Appropriately | Using Precise Evidence to Illustrate a Consequence
}

export const TITLE = 'Title';
export const NAME = 'Name';
export const NOTES = 'Notes';
export const SCORED_READING_LEVEL = 'Scored reading level';
export const TARGET_READING_LEVEL = 'Target reading level';
export const FLAG = 'Flag';
export const PARENT_ACTIVITY_ID = 'Parent Activity ID';
export const HIGHLIGHT_PROMPT = 'Highlight Prompt';
export const PASSAGE = 'Passage';
export const BECAUSE_STEM = 'Because stem';
export const BUT_STEM = 'But stem';
export const SO_STEM = 'So stem';
export const IMAGE_LINK = 'Image link';
export const IMAGE_ALT_TEXT = 'Image alt text';
export const IMAGE_CAPTION = 'Image caption';
export const IMAGE_ATTRIBUTION = 'Image attribution';
export const BUILDING_ESSENTIAL_KNOWLEDGE = 'Building Essential Knowledge';
export const HIGHLIGHTING_PROMPT = 'Highlight Prompt';
export const IMAGE = 'Image';
export const MAX_ATTEMPTS_FEEDBACK = 'Max Attempts Feedback';
export const PROMPTS = 'Prompts'

export const activityFormKeys = [
  FLAG,
  TITLE,
  NOTES,
  PASSAGE,
  BECAUSE_STEM,
  BUT_STEM,
  SO_STEM,
  IMAGE_LINK,
  IMAGE_ALT_TEXT,
  IMAGE_CAPTION,
  IMAGE_ATTRIBUTION,
  HIGHLIGHT_PROMPT,
  FLAG
];

export const MINIMUM_READING_LEVEL = 4;
export const MAXIMUM_READING_LEVEL = 12;

export const numericalWordOptions = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth'
}
