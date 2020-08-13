export function getNonDiagnosticQuestions(diagnosticsData, questionsData) {
  const nonDiagnosticQuestions = {}
  Object.keys(questionsData).forEach((k) => {
    const isDiagnosticQuestion = Object.values(diagnosticsData).some(l => l.questions.some(lq => lq.key === k))
    if (!isDiagnosticQuestion) {
      nonDiagnosticQuestions[k] = questionsData[k]
    }
  })
  return nonDiagnosticQuestions
}
