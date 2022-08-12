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
  {DIAGNOSTIC_LANGUAGE_SELECTED: new Event('diagnosticLanguageSelected', ['event', 'language', 'user_id', 'properties'])}
];

export {
  Event,
  EventDefinitions,
};
