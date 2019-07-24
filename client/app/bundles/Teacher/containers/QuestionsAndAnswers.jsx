import React from 'react'
import QuestionAndAnswer from '../components/shared/QuestionAndAnswer.jsx'
import lessons from '../components/modules/questionsAndAnswers/lessons'
import admin from '../components/modules/questionsAndAnswers/admin'

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
      default:
        questionsAndAnswers = []
        break
    }

    this.state = {
      questionsAndAnswers: questionsAndAnswers()
    }
  }

  renderQuestionsAndAnswers() {
    return this.state.questionsAndAnswers.map((qa, i) => <QuestionAndAnswer key={i} qa={qa}/>)
  }

  render() {
    return(
      <div id="q-and-a">
        <div className="q-and-a-inner-wrapper">
          <h1>Questions and Answers</h1>
          {this.renderQuestionsAndAnswers()}
          <a className="support-link" href={this.props.supportLink}>View All Questions and Answers</a>
        </div>
      </div>
    )
  }

}
