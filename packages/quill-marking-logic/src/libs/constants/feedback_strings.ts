export interface FeedbackStrings {
  punctuationError: string;
  punctuationAndCaseError: string;
  typingError: string;
  caseError: string;
  minLengthError: string;
  maxLengthError: string;
  modifiedWordError: string;
  additionalWordError: string;
  missingWordError: string;
  whitespaceError: string;
  flexibleModifiedWordError: string;
  flexibleAdditionalWordError: string;
  flexibleMissingWordError: string;
  spacingAfterCommaError: string
}

export const feedbackStrings: FeedbackStrings = {
  punctuationError: 'There may be an error. How could you update the punctuation?',
  punctuationAndCaseError: 'There may be an error. How could you update the punctuation and capitalization?',
  typingError: 'Try again. There may be a spelling mistake.',
  caseError: 'Proofread your work. There may be a capitalization error.',
  minLengthError: 'Revise your work. Do you have all of the information from the prompt?',
  maxLengthError: 'Revise your work. How could this sentence be shorter and more concise?',
  modifiedWordError: 'Revise your work. You may have mixed up a word.',
  additionalWordError: 'Revise your work. You may have added an extra word.',
  missingWordError: 'Revise your work. You may have left out an important word.',
  whitespaceError: 'There may be an error. You may have forgotten a space between two words.',
  flexibleModifiedWordError: 'Revise your work. You may have mixed up a word.',
  flexibleAdditionalWordError: 'Revise your work. You may have added an extra word.',
  flexibleMissingWordError: 'Revise your work. You may have left out an important word.',
  spacingAfterCommaError: '<p>Revise your work. Always put a space after a <em>comma</em>.</p>',
};

export const spellingFeedbackStrings: any  = {
  'Capitalization Hint': 'Proofread your work. Check your capitalization and spelling.',
  'Punctuation Hint': 'There may be an error. How could you update the punctuation and spelling?',
  'Punctuation and Case Hint': 'There may be an error. How could you update the punctuation, capitalization, and spelling?',
  'Spelling Hint': 'Try again. There may be a spelling mistake.',
  'Modified Word Hint': 'Revise your work. You may have mixed up or misspelled a word.',
  'Additional Word Hint': 'You may have added an extra word. Revise your work, and then check your spelling',
  'Missing Word Hint': 'You may have left out an important word. Revise your work, and then check your spelling',
  'Whitespace Hint': 'Proofread your work. You may have forgotten a space between two words. Also check your spelling.',
  'Spacing After Comma Hint': feedbackStrings.spacingAfterCommaError
}
