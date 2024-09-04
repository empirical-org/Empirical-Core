import * as React from 'react'

import { EVIDENCE, LESSONS } from '../../Shared'
import { AP, PRE_AP, SPRINGBOARD } from '../components/college_board/collegeBoardConstants'
import admin from '../components/modules/questionsAndAnswers/admin'
import ap from '../components/modules/questionsAndAnswers/ap'
import lessons from '../components/modules/questionsAndAnswers/lessons'
import preap from '../components/modules/questionsAndAnswers/preap'
import premium from '../components/modules/questionsAndAnswers/premium'
import springboard from '../components/modules/questionsAndAnswers/springboard'
import socialStudies from '../components/modules/questionsAndAnswers/socialStudies'
import interdisciplinaryScience from '../components/modules/questionsAndAnswers/interdisciplinaryScience'
import QuestionAndAnswer from '../components/shared/QuestionAndAnswer.jsx'

export interface QuestionsAndAnswersProps {
  questionsAndAnswersFile: string;
  supportLink: string;
  handleChange?: Function;
}

interface QuestionsAndAnswersState {
  questionsAndAnswers: object[]
}

export default class QuestionsAndAnswers extends React.Component<QuestionsAndAnswersProps, QuestionsAndAnswersState> {
  constructor(props: QuestionsAndAnswersProps) {
    super(props)

    let questionsAndAnswers;
    switch (props.questionsAndAnswersFile) {
      case 'admin':
        questionsAndAnswers = admin
        break
      case LESSONS:
        questionsAndAnswers = lessons
        break
      case 'premium':
        questionsAndAnswers = premium
        break
      case PRE_AP:
        questionsAndAnswers = preap
        break
      case AP:
        questionsAndAnswers = ap
        break
      case SPRINGBOARD:
        questionsAndAnswers = springboard
        break
      case 'socialStudies':
        questionsAndAnswers = socialStudies
        break
      case 'interdisciplinaryScience':
        questionsAndAnswers = interdisciplinaryScience
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
    const { questionsAndAnswersFile } = this.props;
    const { questionsAndAnswers } = this.state;
    return questionsAndAnswers.map((qa, i) => <QuestionAndAnswer key={i} qa={qa} questionsAndAnswersFile={questionsAndAnswersFile} />)
  }

  render() {
    const { supportLink } = this.props;
    const style = `support-link ${!supportLink ? 'hidden' : ''}`;

    return(
      <div id="q-and-a">
        <div className="q-and-a-inner-wrapper">
          <h2>Questions and Answers</h2>
          {this.renderQuestionsAndAnswers()}
          <a className={style} href={supportLink}>View all questions and answers</a>
        </div>
      </div>
    )
  }

}
