import * as React from 'react'
import VisibilitySensor from 'react-visibility-sensor'

import QuestionAndAnswer from '../components/shared/QuestionAndAnswer.jsx'
import lessons from '../components/modules/questionsAndAnswers/lessons'
import admin from '../components/modules/questionsAndAnswers/admin'
import premium from '../components/modules/questionsAndAnswers/premium'
import preap from '../components/modules/questionsAndAnswers/preap'
import ap from '../components/modules/questionsAndAnswers/ap'
import evidence from '../components/modules/questionsAndAnswers/evidence'
import springboard from '../components/modules/questionsAndAnswers/springboard'
import { QUESTIONS_AND_ANSWERS, AP, PRE_AP, SPRINGBOARD } from '../components/college_board/collegeBoardConstants';
import { EVIDENCE, LESSONS } from '../../Shared'

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
      case EVIDENCE:
        questionsAndAnswers = evidence
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
    const { supportLink, handleChange, questionsAndAnswersFile } = this.props;
    const style = `support-link ${!supportLink ? 'hidden' : ''}`;
    const collegeBoardPages = [AP, PRE_AP, SPRINGBOARD];
    const showVisibilitySensor = collegeBoardPages.includes(questionsAndAnswersFile);

    return(
      <div id="q-and-a">
        <div className="q-and-a-inner-wrapper">
          {/* eslint-disable-next-line react/jsx-no-bind */}
          {showVisibilitySensor && <VisibilitySensor onChange={(isVisible) => handleChange(isVisible, QUESTIONS_AND_ANSWERS)}>
            <h1>Questions and Answers</h1>
          </VisibilitySensor>}
          {!showVisibilitySensor && <h1>Questions and Answers</h1>}
          {this.renderQuestionsAndAnswers()}
          <a className={style} href={supportLink}>View all questions and answers</a>
        </div>
      </div>
    )
  }

}
