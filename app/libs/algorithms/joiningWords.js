const data = {
  because: {
    feedback: 'Revise your work. Which joining word helps tell why or give a reason?',
    conceptUID: '',
  },
};

export function getFeedbackForMissingWord(missingWord) {
  const hit = data[trimMissingWord(missingWord)];
  if (hit) {
    return hit.feedback;
  }
}

export function getconceptUIDForMissingWord(missingWord) {
  const hit = data[missingWord];
  if (hit) {
    return hit.conceptUID;
  }
}

function trimMissingWord(missingWord) {
  return missingWord.trim();
}
