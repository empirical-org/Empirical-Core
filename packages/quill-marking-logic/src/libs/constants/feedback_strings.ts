export interface FeedbackStrings {
  punctuationError: string;
  punctuationEndError: string;
  punctuationAndCaseError: string;
  typingError: string;
  caseError: string;
  minLengthError: string;
  maxLengthError: string;
  modifiedWordError: string;
  additionalWordError: string;
  missingWordError: string;
  missingWhitespaceError: string;
  extraWhitespaceError: string;
  flexibleModifiedWordError: string;
  flexibleAdditionalWordError: string;
  flexibleMissingWordError: string;
  spacingAfterCommaError: string;
  wordsOutOfOrderError: string;
}

export const feedbackStrings: FeedbackStrings = {
  punctuationError: 'Proofread your work. Check your punctuation.',
  punctuationEndError: 'Proofread your work. Check your ending punctuation.',
  punctuationAndCaseError: 'Proofread your work. Check your punctuation and capitalization.',
  typingError: 'Proofread your work. Check your spelling.',
  caseError: 'Proofread your work. Check your capitalization.',
  minLengthError: 'Revise your work. Do you have all of the information from the prompt?',
  maxLengthError: 'Revise your work. How could your response be shorter and more concise?',
  modifiedWordError: 'Revise your work. You may have mixed up a word.',
  additionalWordError: 'Revise your work. You may have added one or two extra words.',
  missingWordError: 'Revise your work. You may have left out one or two important words.',
  missingWhitespaceError: 'Check your spacing. You may have forgotten a space between two words.',
  extraWhitespaceError: 'Check your spacing. You may have added an extra space in the middle of a word.',
  flexibleModifiedWordError: 'Revise your work. You may have mixed up a word.',
  flexibleAdditionalWordError: 'Revise your work. You may have added one or two extra words.',
  flexibleMissingWordError: 'Revise your work. You may have left out one or two important words.',
  spacingAfterCommaError: 'Revise your work. Always put a space after a comma.',
  wordsOutOfOrderError: 'Proofread your sentence. You may have mixed up the order of some words.',
};

export const spellingFeedbackStrings: any = {
  'Capitalization Hint': 'Proofread your work. Check your capitalization and spelling.',
  'Punctuation Hint': 'Proofread your work. Check your punctuation and spelling.',
  'Punctuation and Case Hint': 'Proofread your work. Check your punctuation and spelling.',
  'Spelling Hint': 'Proofread your work. Check your spelling.',
  'Modified Word Hint': 'Revise your work. You may have mixed up or misspelled a word.',
  'Additional Word Hint': 'You may have added one or two extra words. Proofread your work, and check your spelling.',
  'Missing Word Hint': 'You may have left out one or two important words. Revise your work, and then check your spelling.',
  'Whitespace Hint': 'Proofread your work. You may have forgotten a space between two words. Also check your spelling.',
  'Spacing After Comma Hint': feedbackStrings.spacingAfterCommaError
}
