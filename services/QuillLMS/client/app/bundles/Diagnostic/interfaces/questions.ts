/*
  There are a LOT of non-required properties in these interfaces.
  These are, as best I can tell, the current expected properties
  for each type, but because Firebase has a bunch of historical
  data, I can't guarantee that these properties are actually
  present on any given instance from the database, so we're playing
  it safe.
*/

export interface ConceptResult {
  conceptUID?: string,
  correct?: boolean,
  name?: string,
}

export interface ConceptResultCollection {
  [key: string]: ConceptResult,
}

export interface FocusPoint {
  conceptResults: ConceptResultCollection,
  feedback?: string,
  order?: string,
  text?: string,
}

export interface FocusPointCollection {
  [key: string]: FocusPoint;
}

export interface IncorrectSequence {
  conceptResults?: ConceptResultCollection;
  feedback?: string;
  text?: string;
}

export interface IncorrectSequenceCollection {
  [key: string]: IncorrectSequence;
}

export interface Questions {
  [key: string]: Question
}

export interface Question {
  conceptUID?: string;
  cues?: string[];
  cuesLabel?: string;
  flag?: string;
  focusPoints?: FocusPointCollection;
  incorrectSequences?: IncorrectSequenceCollection;
  instructions?: string;
  modelConceptUID?: string;
  prompt?: string;
}

export interface QuestionCollection {
  [key: string]: Question;
}
