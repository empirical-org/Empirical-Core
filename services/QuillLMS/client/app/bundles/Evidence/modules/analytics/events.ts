import { EventDefinitions } from './event_definitions';


// Ensure that no two events accidentally share the same name,
// either as the constant identifier, or as the literal passed
// to analytics
function validateEventsList(eventDefinitions: Array<any>): void {
  function checkForDuplicates(target: Array<any>) {
    if (new Set(target).size != target.length) {
      throw new Error('There are duplicate values in the provided array.');
    }
  }
  let eventReferences = eventDefinitions.map((d) => Object.keys(d)[0]);
  let eventNames = eventDefinitions.map((d) => Object.values(d)[0]['name']);
  try {
    checkForDuplicates(eventReferences);
    checkForDuplicates(eventNames);
  } catch {
    throw new Error('At least two defined events have the same name assigned.');
  }
}
validateEventsList(EventDefinitions);


// Turn our array of definitions into a nice, referenceable object
function arrayToObject(sourceArray) {
  return sourceArray.reduce((accumulator, eventDefinition) => Object.assign(accumulator, eventDefinition), {});
}

let buildEvents = arrayToObject(EventDefinitions)
buildEvents.providers = {
  CLEVER: 'clever',
  EMAIL: 'email',
  GOOGLE: 'google',
};
const Events = buildEvents;


export default Events;
