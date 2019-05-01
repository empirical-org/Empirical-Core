class Event {
  name: string;
  requiredProperties?: array;
}


// Even though we ultimately want to expose a single object with
// different events differentiated by key, we define our events
// as an array of simple objects so that we can validate that
// as the list gets longer we don't accidentally end up with a
// name collision (see validation in the 'events.ts' file).
const EventDefinitions = [
  {
    TEST_EVENT: <Event>({
      name: 'Test Event'
    })
  },
  {
    TEST_EVENT2: <Event>({
      name: 'Test Event 2',
      requiredProperties: [
        'prop1',
        'prop2',
      ],
    })
  },
];
export default EventDefinitions;
