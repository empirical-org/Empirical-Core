declare function require(name:string);
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

interface ListBlankProps {
  data: QuestionData;
  mode?: null|string;
  handleStudentSubmission?: Function;
  selected_submissions?: SelectedSubmissionsForQuestion|null;
  submissions?: QuestionSubmissionsList|null;
  selected_submission_order?: Array<string> | null;
  projector?: boolean|null
}
interface ListBlankState {
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

class ListBlanks extends React.Component<ListBlankProps, ListBlankState> {
  constructor(props) {
    super(props)

    const submittedAnswers = savedSubmission(props.submissions)
    this.state = {
      answers: submittedAnswers || {}
    }
  }

  customChangeEvent = (e, index) => {
    const newState = {...this.state}
    newState.answers[index] = e
    this.setState(newState)
  }

  renderProjectedAnswers() {
    const { answers, } = this.state
    const { selected_submissions, selected_submission_order, data, projector, submissions, mode, } = this.props

    if (mode !== PROJECT) { return }
    const { sampleCorrectAnswer, } = data.play

    return (
      <ProjectedAnswers
        projector={projector}
        response={answers}
        sampleCorrectAnswer={sampleCorrectAnswer}
        selectedSubmissionOrder={selected_submission_order}
        selectedSubmissions={selected_submissions}
        submissions={submissions}
      />
    )
  }

  isSubmittable = () => {
    const { answers, } = this.state
    const { data, } = this.props
    return data.play.nBlanks === answerCount(answers)
  }

  textEditListComponents(i){
    const { projector, submissions, } = this.props
    const { answers, } = this.state
    const submittedAnswers = savedSubmission(submissions)
    const disabled:boolean = (submittedAnswers && submittedAnswers[i]) || projector
    const value = projector ? 'Students type responses here' : answers[i]
    return (
      <div className="list-component" key={`${i}`}>
        <span className="list-number">{`${i + 1}.`}</span>
        <TextEditor
          disabled={disabled}
          editorIndex={i}
          handleChange={this.customChangeEvent}
          placeholder="Type your response here"
          value={value}
        />
      </div>
    )
  }

  listBlanks() {
    const { data, } = this.props
    const { nBlanks, } = data.play
    const textEditorArr : JSX.Element[]  = [];
    for (let i = 0; i < nBlanks; i+=1) {
      textEditorArr.push(
        this.textEditListComponents(i)
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

    if (!data.play.instructions && (!submittedAnswers || answerCount(submittedAnswers) === data.play.nBlanks)) { return }

    let feedback = data.play.instructions
    let feedbackType = 'default'
    if (submittedAnswers && (answerCount(submittedAnswers) !== data.play.nBlanks)) {
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
    const submitButton = answerCount(savedSubmission(submissions)) === data.play.nBlanks ? null : <SubmitButton disabled={!this.isSubmittable()} onClick={this.handleStudentSubmission} />
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

    if (!submittedAnswers || answerCount(submittedAnswers) !== data.play.nBlanks || mode === PROJECT) { return }

    return <div className="submitted-bar">Please wait as your teacher reviews your response.</div>
  }

  render() {
    return (
      <div className="list-blanks-container student-slide-wrapper">
        <div className="all-but-submitted-bar">
          {this.renderProjectorHeader()}
          {this.renderModeSpecificContent()}
        </div>
        {this.renderSubmittedBar()}
      </div>
    );
  }

}

export default ListBlanks;
