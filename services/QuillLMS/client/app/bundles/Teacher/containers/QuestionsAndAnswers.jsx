import React from 'react'
import QuestionAndAnswer from '../components/shared/QuestionAndAnswer.jsx'
import lessons from '../components/modules/questionsAndAnswers/lessons'
import admin from '../components/modules/questionsAndAnswers/admin'
import premium from '../components/modules/questionsAndAnswers/premium'

export default class QuestionsAndAnswers extends React.Component {
  constructor(props) {
    super(props)

    let questionsAndAnswers
    switch (props.questionsAndAnswersFile) {
      case 'admin':
        questionsAndAnswers = admin
        break
      case 'lessons':
        questionsAndAnswers = lessons
        break
      case 'premium':
        questionsAndAnswers = premium
        break
      default:
        questionsAndAnswers = []
        break
    }

    this.state = {
      questionsAndAnswers: questionsAndAnswers()
    }
  }

  renderQuestionsAndAnswers() {
    const { questionsAndAnswersFile } = this.props
    return this.state.questionsAndAnswers.map((qa, i) => <QuestionAndAnswer key={i} qa={qa} questionsAndAnswersFile={questionsAndAnswersFile} />)
  }

  render() {
    return(
      <div id="q-and-a">
        <div className="q-and-a-inner-wrapper">
          <h1>Questions and Answers</h1>
          {this.renderQuestionsAndAnswers()}
          <a className="support-link" href={this.props.supportLink}>View all questions and answers</a>
        </div>
      </div>
    )
  }

}
