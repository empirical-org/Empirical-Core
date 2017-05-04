import React from 'react'

export default class DiagnosticProgressReport extends React.Component {

  getProgressPercent() {
    let percent
    const playDiagnostic = this.props.playDiagnostic
    if (playDiagnostic && playDiagnostic.unansweredQuestions && playDiagnostic.questionSet) {
      const questionSetCount = playDiagnostic.questionSet.length
      const answeredQuestionCount = questionSetCount - this.props.playDiagnostic.unansweredQuestions.length
      if (this.props.playDiagnostic.currentQuestion) {
        percent = ((answeredQuestionCount - 1) / questionSetCount) * 100;
      } else {
        percent = ((answeredQuestionCount) / questionSetCount) * 100
      }
    } else {
      percent = 0;
    }
    return percent
  }

  render() {
    return <progress className="progress diagnostic-progress" value={this.getProgressPercent()} max="100">15%</progress>
  }
}
