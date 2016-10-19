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

function _formatIndividualTaggedConceptResults(cr, question){
  const returnValue = {};
  const prompt = question.questionText
  const answer = question.attempts[0].submitted;
  const directions = 'placeholder'
  const correct = cr.correct
  returnValue.concept_uid = cr.conceptUID;
  returnValue.metadata = {
    correct,
    directions,
    prompt,
    answer
  }
  return returnValue
}

export function getTaggedConceptResults(question) {
  let attempt = question.attempts[0]
  if (attempt && attempt.response && attempt.response.conceptResults) {
    let conceptResults = attempt.response.conceptResults;
    let conceptResultsArr = [];
    for (var prop in conceptResults) {
      conceptResultsArr.push(_formatIndividualTaggedConceptResults(conceptResults[prop], question));
    }
    return (conceptResultsArr);
  }
}


function calculateCorrectnessOfSentence(attempt) {
  if (attempt && attempt.response) {
    return attempt.response.optimal ? 1 : 0
  } else {
    return 1
  }
}

export function getAllSentenceFragmentConceptResults (question) {
    let conceptResults;
    if (question.needsIdentification) {
       conceptResults = [
        getIdentificationConceptResult(question),
        getCompleteSentenceConceptResult(question)
      ]
    } else {
       conceptResults = [
        getCompleteSentenceConceptResult(question)
      ]
    }
    const taggedResults = getTaggedConceptResults(question);
    return taggedResults ? conceptResults.concat(taggedResults) : conceptResults
}
