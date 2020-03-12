export function getDiagnosticQuestions(lessonsData, questionsData) {
  const diagnosticQuestions = {}
  Object.keys(questionsData).forEach((k) => {
    const isDiagnosticQuestion = Object.values(lessonsData).some(l => l.questions.some(lq => lq.key === k))
    if (isDiagnosticQuestion) {
      diagnosticQuestions[k] = questionsData[k]
    }
  })
  return diagnosticQuestions
}
