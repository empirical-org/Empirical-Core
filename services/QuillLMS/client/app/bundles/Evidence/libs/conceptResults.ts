import { DIRECTIONS, } from '../components/studentView/promptStep'

export const generateConceptResults = (currentActivity, submittedResponses, topicOptimalData) => {
  const conjunctionToQuestionNumber = {
    because: 1,
    but: 2,
    so: 3
  }

  const conceptResults = []

  for (const [promptID, responses] of Object.entries(submittedResponses)) {
    const prompt = Object.values(currentActivity.prompts).filter((prompt) => String(prompt.id) === String(promptID))[0]
    responses.forEach((response, index) => {
      const attempt = index + 1
      const conceptResultMetadata = {
        answer: response.entry,
        attemptNumber: attempt,
        correct: response.optimal ? 1 : 0,
        directions: (attempt === 1) ? DIRECTIONS : responses[index - 1].feedback,
        prompt: prompt.text,
        questionNumber: conjunctionToQuestionNumber[prompt.conjunction],
        questionScore: responses.some((r) => r.optimal) ? 1.0 : 0.0
      }

      if (topicOptimalData && topicOptimalData.rule_types.includes(response.feedback_type)) {
        conceptResults.push({
          concept_uid: topicOptimalData.concept_uids[prompt.id],
          question_type: 'comprehension',
          metadata: {
            ...conceptResultMetadata,
            ...{correct: 1}
          }
        })
      }

      conceptResults.push({
        concept_uid: response.concept_uid,
        question_type: 'comprehension',
        metadata: conceptResultMetadata
      })
    })
  }
  return conceptResults
}

export const generatePercentageScore = (conceptResults) => {
  const questionScores: {[key:number]: number} = {};

  conceptResults.forEach(result => {
    const { questionNumber, questionScore } = result.metadata;
    if (!questionScores[questionNumber]) {
      questionScores[questionNumber] = questionScore;
    }
  });


  const totalScore: number = Object.values(questionScores).reduce((acc, score) => acc + score, 0);
  const totalQuestions = Object.keys(questionScores).length

  const percentageScore = totalQuestions ? Math.round((totalScore/totalQuestions) * 100) / 100 : null

  return percentageScore;
};
