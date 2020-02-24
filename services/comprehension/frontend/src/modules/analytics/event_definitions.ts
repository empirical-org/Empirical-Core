class Event {
  name: string;
  requiredProperties?: Array<string>;

  constructor(name: string, requiredProperties?: Array<string>) {
    this.name = name;
    this.requiredProperties = requiredProperties;
  }
}


// Even though we ultimately want to expose a single object with
// different events differentiated by key, we define our events
// as an array of simple objects so that we can validate that
// as the list gets longer we don't accidentally end up with a
// name collision (see validation in the 'events.ts' file).
const EventDefinitions = [
  {COMPREHENSION_ACTIVITY_STARTED: new Event('comprehensionActivityStarted', [
    'activityId',
    'sessionID'])},
  {COMPREHENSION_PASSAGE_READ: new Event('comprehensionPassageRead', [
    'activityId',
    'sessionID'])},
  {COMPREHENSION_PROMPT_STARTED: new Event('comprehensionPromptStarted', [
    'activityId',
    'promptID',
    'sessionID'])},
  {COMPREHENSION_ENTRY_SUBMITTED: new Event('comprehensionEntrySubmitted', [
    'activityId',
    'attemptNumber',
    'promptID',
    'promptStemText',
    'sessionID',
    'startingFeedback',
    'startingFeedbackId',
    'submittedEntry'])},
  {COMPREHENSION_FEEDBACK_RECEIVED: new Event('comprehensionFeedbackReceived', [
    'activityId',
    'attemptNumber',
    'promptID',
    'promptStemText',
    'returnedFeedback',
    'returnedFeedbackId',
    'sessionID',
    'startingFeedback',
    'startingFeedbackId',
    'submittedEntry'])},
  {COMPREHENSION_FEEDBACK_RECEIVED: new Event('comprehensionFeedbackReceived', [
    'activityId',
    'attemptNumber',
    'promptID',
    'promptStemText',
    'returnedFeedback',
    'returnedFeedbackId',
    'sessionID',
    'startingFeedback',
    'startingFeedbackId',
    'submittedEntry'])},
  {COMPREHENSION_PROMPT_COMPLETED: new Event('comprehensionPromptCompleted', [
    'activityId',
    'promptID',
    'sessionID'])},
  {COMPREHENSION_ACTIVITY_COMPLETED: new Event('comprehensionActivityCompleted', [
    'activityId',
    'sessionID'])},
  {COMPREHENSION_ACTIVITY_SAVED: new Event('comprehensionActivitySaved', [
    'activityId',
    'sessionID'])}
];


export {
  Event,
  EventDefinitions,
};
