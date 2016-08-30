export function getIdentificationConceptResult(question) {
  const returnValue = {}
  const correct = question.identified ? 1 : 0
  const prompt = question.questionText
  const directions = "Is this a sentence or a fragment?"
  let answer, concept_uid
  if(question.isFragment) {
    answer = question.identified ? "Fragment": "Sentence";
    concept_uid = 'j89kdRGDVjG8j37A12p37Q';
  } else {
    answer = question.identified ? "Sentence": "Fragment";
    concept_uid = 'LH3szu784pXA5k2N9lxgdA';
  }
  returnValue.concept_uid = concept_uid
  returnValue.metadata = {
    correct,
    directions,
    prompt,
    answer
  }
  return returnValue
}

export function getCompleteSentenceConceptResult(question) {
  const returnValue = {};
  const correct = calculateCorrectnessOfSentence(question.attempts[0]);
  const concept_uid = 'KfA8-dg8FvlJz4eY0PkekA';
  const answer = question.attempts[0].submitted;
  const directions = "Add/change as few words as you can to change this fragment into a sentence"
  const prompt = question.questionText
  returnValue.concept_uid = concept_uid;
  returnValue.metadata = {
    correct,
    directions,
    prompt,
    answer
  }
  return returnValue
}


function calculateCorrectnessOfSentence(attempt) {
  if (attempt && attempt.response) {
    return attempt.response.optimal ? 1 : 0
  } else {
    return 0
  }
}

export function getAllSentenceFragmentConceptResults (question) {
    return [
      getIdentificationConceptResult(question),
      getCompleteSentenceConceptResult(question)
    ]
}
