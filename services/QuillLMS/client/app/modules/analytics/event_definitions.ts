class Event {
  name: string;
  requiredProperties?: array;

  constructor(name: string, requiredProperties: array) {
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
  {TEST_EVENT: new Event('Test Event')},
  {TEST_EVENT2: new Event('Test Event 2', ['prop1', 'prop2'])},
];
export {
  Event,
  EventDefinitions,
};
