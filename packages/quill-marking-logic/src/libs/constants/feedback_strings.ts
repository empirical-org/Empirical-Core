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
  missingWhitespaceError: string;
  tooMuchWhitespaceError: string;
  flexibleModifiedWordError: string;
  flexibleAdditionalWordError: string;
  flexibleMissingWordError: string;
  spacingAfterCommaError: string;
  wordsOutOfOrderError: string;
}

export const feedbackStrings: FeedbackStrings = {
  punctuationError: 'Proofread your work. Check your punctuation.',
  punctuationAndCaseError: 'Proofread your work. Check your punctuation and capitalization.',
  typingError: 'Proofread your work. Check your spelling.',
  caseError: 'Proofread your work. Check your capitalization.',
  minLengthError: 'Revise your work. Do you have all of the information from the prompt?',
  maxLengthError: 'Revise your work. How could your response be shorter and more concise?',
  modifiedWordError: 'Revise your work. You may have mixed up a word.',
  additionalWordError: 'Revise your work. You may have added an extra word.',
  missingWordError: 'Revise your work. You may have left out an important word.',
  missingWhitespaceError: 'Check your spacing. You may have forgotten a space between two words.',
  tooMuchWhitespaceError: 'Check your spacing. You may have added an extra space between words.',
  flexibleModifiedWordError: 'Revise your work. You may have mixed up a word.',
  flexibleAdditionalWordError: 'Revise your work. You may have added an extra word.',
  flexibleMissingWordError: 'Revise your work. You may have left out an important word.',
  spacingAfterCommaError: 'Revise your work. Always put a space after a comma.',
  wordsOutOfOrderError: 'Proofread your sentence. You may have mixed up the order of some words.',
};

export const spellingFeedbackStrings: any = {
  'Capitalization Hint': 'Proofread your work. Check your capitalization and spelling.',
  'Punctuation Hint': 'Proofread your work. Check your punctuation and spelling.',
  'Punctuation and Case Hint': 'Proofread your work. Check your punctuation and spelling.',
  'Spelling Hint': 'Proofread your work. Check your spelling.',
  'Modified Word Hint': 'Revise your work. You may have mixed up or misspelled a word.',
  'Additional Word Hint': 'You may have added an extra word. Proofread your work, and check your spelling.',
  'Missing Word Hint': 'You may have left out an important word. Revise your work, and then check your spelling.',
  'Whitespace Hint': 'Proofread your work. You may have forgotten a space between two words. Also check your spelling.',
  'Spacing After Comma Hint': feedbackStrings.spacingAfterCommaError
}
