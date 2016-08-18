export function getIdentificationConceptResult(question) {
  const returnValue = {}
  const correct = question.identified ? 1 : 0
  const prompt = question.questionText
  const directions = "Is this a sentence or a fragment?"
  let answer, concept_uid
  if(question.isFragment) {
    answer = question.identified ? "Fragment": "Sentence";
    concept_uid = 'T_Io_fJGN8BZWf_Nb30LBg';
  } else {
    answer = question.identified ? "Sentence": "Fragment";
    concept_uid = 'd3V33ijcTE33QIPIzLa4-Q';
  }
  returnValue.concept_uid = concept_uid
  returnValue.metadata = {
    correct: correct,
    directions: "Is this a sentence or a fragment?",
    prompt: prompt,
    answer: answer
  }
  return returnValue
}
