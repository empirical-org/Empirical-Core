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
    'activityID',
    'sessionID'])},
  {COMPREHENSION_PASSAGE_READ: new Event('comprehensionPassageRead', [
    'activityID',
    'sessionID',
    'user_id',
    'properties'])},
  {COMPREHENSION_PROMPT_STARTED: new Event('comprehensionPromptStarted', [
    'activityID',
    'promptID',
    'sessionID'])},
  {COMPREHENSION_ENTRY_SUBMITTED: new Event('comprehensionEntrySubmitted', [
    'activityID',
    'attemptNumber',
    'promptID',
    'promptStemText',
    'sessionID',
    'startingFeedback',
    'startingFeedbackID',
    'submittedEntry'])},
  {COMPREHENSION_FEEDBACK_RECEIVED: new Event('comprehensionFeedbackReceived', [
    'activityID',
    'attemptNumber',
    'promptID',
    'promptStemText',
    'returnedFeedback',
    'returnedFeedbackID',
    'sessionID',
    'startingFeedback',
    'startingFeedbackID',
    'submittedEntry',
    'user_id',
    'properties'])},
  {COMPREHENSION_PROMPT_COMPLETED: new Event('comprehensionPromptCompleted', [
    'activityID',
    'promptID',
    'sessionID',
    'user_id',
    'properties'])},
  {COMPREHENSION_ACTIVITY_COMPLETED: new Event('comprehensionActivityCompleted', [
    'activityID',
    'sessionID',
    'user_id',
    'properties'])},
  {COMPREHENSION_ACTIVITY_SAVED: new Event('comprehensionActivitySaved', [
    'activityID',
    'sessionID'])}
];


export {
  Event,
  EventDefinitions,
};
