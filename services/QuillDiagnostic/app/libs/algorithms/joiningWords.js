const constants = {
  timing: 'Revise your work. Which joining word helps show the timing of the events?',
  opposite: 'Revise your work. Which joining word helps show that the two ideas are opposite?',
  reason: 'Revise your work. Which joining word helps tell why or give a reason?',
  prerequisite: 'Revise your work. Which joining word helps show that one of the ideas must happen for the other one to happen?',
  choice: 'Revise your work. Which joining word is used to show a choice?',
  and: 'Revise your work. Which joining word is used to add another idea?',
};

const data = {
  after: {
    feedback: constants.timing,
  },
  'as soon as': {
    feedback: constants.timing,
  },
  before: {
    feedback: constants.timing,
  },
  whenever: {
    feedback: constants.timing,
  },
  while: {
    feedback: constants.timing,
  },
  once: {
    feedback: constants.timing,
  },
  when: {
    feedback: constants.timing,
  },
  until: {
    feedback: constants.timing,
  },
  although: {
    feedback: constants.opposite,
  },
  'even though': {
    feedback: constants.opposite,
  },
  though: {
    feedback: constants.opposite,
  },
  but: {
    feedback: constants.opposite,
  },
  yet: {
    feedback: constants.opposite,
  },
  since: {
    feedback: constants.reason,
  },
  so: {
    feedback: constants.reason,
  },
  because: {
    feedback: constants.reason,
  },
  for: {
    feedback: constants.reason,
  },
  as: {
    feedback: constants.reason,
  },
  'as long as': {
    feedback: constants.prerequisite,
  },
  if: {
    feedback: constants.prerequisite,
  },
  unless: {
    feedback: constants.prerequisite,
  },
  'in order to': {
    feedback: constants.prerequisite,
  },
  or: {
    feedback: constants.choice,
  },
  nor: {
    feedback: constants.choice,
  },
  and: {
    feedback: constants.and,
  },
};

export function getFeedbackForMissingWord(missingWord) {
  if (missingWord) {
    const hit = data[cleanMissingWord(missingWord)];
    if (hit) {
      return hit.feedback;
    }
  }
}

export function getconceptUIDForMissingWord(missingWord) {
  const hit = data[missingWord];
  if (hit) {
    return hit.conceptUID;
  }
}

function cleanMissingWord(missingWord) {
  return missingWord.trim().toLowerCase();
}
