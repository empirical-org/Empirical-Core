import * as React from 'react';
import * as _ from 'lodash'
import {
  Feedback,
  SentenceFragments,
} from '../../../../Shared/index'

import {
  QuestionData,
} from '../../../interfaces/classroomLessons'
import {
  ClassroomLessonSession,
  SelectedSubmissionsForQuestion,
  QuestionSubmissionsList
} from '../interfaces'
import TextEditor from '../../renderForQuestions/renderTextEditor';
import SubmitButton from './submitButton'
import ProjectorHeader from './projectorHeader'
import ProjectedAnswers from './projectedAnswers'
import PromptSection from './promptSection'
import { PROJECT } from './constants'

import { getParameterByName } from '../../../libs/getParameterByName';

interface MultistepProps {
  data: QuestionData;
  mode?: null|string;
  handleStudentSubmission?: Function;
  selected_submissions?: SelectedSubmissionsForQuestion|null;
  submissions?: QuestionSubmissionsList|null;
  selected_submission_order?: Array<string> | null;
  projector?: boolean|null
}
interface MultistepState {
  answers: { [key:string]: string };
}

const answerCount = (answers) => {
  if (!answers) { return 0 }

  return Object.values(answers).filter(val => val).length
}

const savedSubmission = (submissions) => {
  const student = getParameterByName('student')
  return submissions && submissions[student] && submissions[student].data
}

class Multistep extends React.Component<MultistepProps, MultistepState> {
  constructor(props) {
    super(props)

    const answerHash = {}
    props.data.play.stepLabels.forEach((sl) => answerHash[sl] = '')
    let answers = savedSubmission(props.submissions)
    if (!answers) {
      answers = {}
      props.data.play.stepLabels.forEach((sl) => answers[sl] = '')
    }
    this.state = {
      answers
    }
  }

  customChangeEvent = (e, sl) => {
    const newState = {...this.state}
    newState.answers[sl] = e
    this.setState(newState)
  }

  renderProjectedAnswers() {
    const { answers, } = this.state
    const { selected_submissions, selected_submission_order, data, projector, submissions, mode, } = this.props

    if (mode !== PROJECT) { return }
    const { sampleCorrectAnswer, } = data.play

    const commonProps = { projector, submissions, sampleCorrectAnswer, }
    const rows = data.play.stepLabels.map((sl, i) => {
      const response = { [sl]: answers[sl] }
      const selectedSubmissionOrder = selected_submission_order.filter(key => key.includes(sl))
      const selectedSubmissions = {}
      Object.keys(selected_submissions).filter(key => key.includes(sl)).forEach(key => selectedSubmissions[key] = selected_submissions[key])
      let className = "multistep-display-answers-row "
      className+= i === 0 ? 'first' : ''

      return (
        <div className={className} key={sl}>
          <p className="step-label">{sl}</p>
          <ProjectedAnswers
            {...commonProps}
            response={response}
            selectedSubmissionOrder={selectedSubmissionOrder}
            selectedSubmissions={selectedSubmissions}
          />
        </div>
      )
    })

    return rows
  }

  isSubmittable = () => {
    const { answers, } = this.state
    const { data, } = this.props
    return data.play.stepLabels.length === answerCount(answers)
  }

  textEditListComponents(sl, i){
    const { projector, submissions, } = this.props
    const { answers, } = this.state
    const submittedAnswers = savedSubmission(submissions)
    const disabled:boolean = (submittedAnswers && submittedAnswers[sl]) || projector
    const value = projector ? 'Students type responses here' : answers[sl]
    let className = "list-component "
    className+= i === 0 ? 'first' : ''
    return (
      <div className={className} key={sl}>
        <span className="step-label">{sl}</span>
        <TextEditor
          disabled={disabled}
          editorIndex={sl}
          handleChange={this.customChangeEvent}
          placeholder="Type your response here"
          value={value}
        />
      </div>
    )
  }

  listBlanks() {
    const { data, } = this.props
    const { stepLabels, } = data.play
    const nStepLabels = stepLabels.length;
    const textEditorArr : JSX.Element[]  = [];
    for (let i = 0; i < nStepLabels; i+=1) {
      textEditorArr.push(
        this.textEditListComponents(stepLabels[i], i)
      )
    }
    return (
      <div className="list-blanks">
        {textEditorArr}
      </div>
    )
  }

  handleStudentSubmission = () => {
    const { answers, } = this.state
    const { handleStudentSubmission, } = this.props
    if (this.isSubmittable() && handleStudentSubmission) {
      handleStudentSubmission(answers)
    }
  }

  renderProjectorHeader() {
    const { projector, studentCount, submissions, mode, } = this.props

    if (!projector || mode === PROJECT) { return }

    return <ProjectorHeader studentCount={studentCount} submissions={submissions} />
  }

  renderInstructions() {
    const { data, submissions, } = this.props

    const submittedAnswers = savedSubmission(submissions)

    if (!data.play.instructions && (!submittedAnswers || answerCount(submittedAnswers) === data.play.stepLabels.length)) { return }

    let feedback = data.play.instructions
    let feedbackType = 'default'
    if (submittedAnswers && (answerCount(submittedAnswers) !== data.play.stepLabels.length)) {
      feedback = 'Your teacher wants you to try again. Submit a new response.'
      feedbackType = 'revise-unmatched'
    }

    return (
      <Feedback
        feedback={(<p dangerouslySetInnerHTML={{__html: feedback}} />)}
        feedbackType={feedbackType}
      />
    );
  }

  renderModeSpecificContent(){
    const { mode, data, submissions, } = this.props
    const prompt = <SentenceFragments prompt={data.play.prompt} />
    const promptSection = (
      <PromptSection
        mode={mode}
        promptElement={prompt}
      />
    )
    if (mode === PROJECT) {
      return (
        <React.Fragment>
          {promptSection}
          {this.renderProjectedAnswers()}
        </React.Fragment>
      )
    }
    const submitButton = answerCount(savedSubmission(submissions)) === data.play.stepLabels.length ? null : <SubmitButton disabled={!this.isSubmittable()} onClick={this.handleStudentSubmission} />
    return (
      <React.Fragment>
        {promptSection}
        {this.renderInstructions()}
        {this.listBlanks()}
        {submitButton}
      </React.Fragment>
    )
  }

  renderSubmittedBar() {
    const { mode, data, submissions, } = this.props

    const submittedAnswers = savedSubmission(submissions)

    if (!submittedAnswers || answerCount(submittedAnswers) !== data.play.stepLabels.length || mode === PROJECT) { return }

    return <div className="submitted-bar">Please wait as your teacher reviews your response.</div>
  }

  render() {
    const { projector, } = this.props
    let className = "multistep student-slide-wrapper "
    className+= projector ? 'projector ' : ''
    return (
      <div className={className}>
        <div className="all-but-submitted-bar">
          {this.renderProjectorHeader()}
          {this.renderModeSpecificContent()}
        </div>
        {this.renderSubmittedBar()}
      </div>
    );
  }

}

export default Multistep;
