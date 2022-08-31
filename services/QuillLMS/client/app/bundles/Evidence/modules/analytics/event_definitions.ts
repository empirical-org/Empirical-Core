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
  {EVIDENCE_ACTIVITY_STARTED: new Event('evidenceActivityStarted', [
    'event',
    'activityID',
    'sessionID',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_PASSAGE_READ: new Event('evidencePassageRead', [
    'event',
    'activityID',
    'sessionID',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_PROMPT_STARTED: new Event('evidencePromptStarted', [
    'event',
    'activityID',
    'promptID',
    'sessionID',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_ENTRY_SUBMITTED: new Event('evidenceEntrySubmitted', [
    'event',
    'activityID',
    'attemptNumber',
    'promptID',
    'promptStemText',
    'sessionID',
    'startingFeedback',
    'startingFeedbackID',
    'submittedEntry',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_FEEDBACK_RECEIVED: new Event('evidenceFeedbackReceived', [
    'event',
    'activityID',
    'attemptNumber',
    'promptID',
    'hint',
    'promptStemText',
    'returnedFeedback',
    'sessionID',
    'startingFeedback',
    'submittedEntry',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_PROMPT_COMPLETED: new Event('evidencePromptCompleted', [
    'event',
    'activityID',
    'promptID',
    'sessionID',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_ACTIVITY_COMPLETED: new Event('evidenceActivityCompleted', [
    'event',
    'activityID',
    'sessionID',
    'user_id',
    'properties'
  ])},
  {EVIDENCE_ACTIVITY_SAVED: new Event('evidenceActivitySaved', [
    'event',
    'activityID',
    'sessionID',
    'user_id',
    'properties'
  ])},
  {STUDENT_RATED_AN_ACTIVITY: new Event('Student rated an activity', [
    'event',
    'user_id',
    'properties'
  ])}
];


export {
  Event,
  EventDefinitions,
};
