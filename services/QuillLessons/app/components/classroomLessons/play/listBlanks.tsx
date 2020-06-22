declare function require(name:string);
import * as React from 'react';
import * as _ from 'lodash'
import {
  Feedback,
  SentenceFragments,
} from 'quill-component-library/dist/componentLibrary'

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

import numberToWord from '../../../libs/numberToWord'
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
  submittedAnswers?: { [key:string]: string };
}

const toObject = (answers) => {
  const arr = answers.split('; ')
  const objectifiedArr = {};
  for (var i = 0; i < arr.length; i+=1) {
    objectifiedArr[i] = arr[i];
  }
  return objectifiedArr;
}

const answerCount = (answers) => {
  let nonBlankAnswers = 0;
  if (answers) {
      // counts the number of truthy answers or adds to empty answer count
      for (let key in answers) {
        answers[key] ? nonBlankAnswers+=1 : null
      }
  }
  return nonBlankAnswers
}

const savedSubmission = (props) => {
  const student = getParameterByName('student')
  return props.submissions && props.submissions[student] && props.submissions[student].data && toObject(props.submissions[student].data)
}


class ListBlanks extends React.Component<ListBlankProps, ListBlankState> {
  constructor(props) {
    super(props)

    const submittedAnswers = savedSubmission(props)
    this.state = {
      answers: submittedAnswers || {},
      submittedAnswers
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!_.isEqual(savedSubmission(props), state.submittedAnswers)) {
      return {
        submittedAnswers: savedSubmission(props)
      };
    }
    return null;
  }

  customChangeEvent = (e, index) => {
    const newState = {...this.state}
    newState.answers[index] = e
    this.setState(newState)
  }

  renderProject() {
    const { selected_submissions, selected_submission_order, data, projector, submissions, mode, } = this.props

    if (mode !== PROJECT) { return }
    const { sampleCorrectAnswer, } = data.play

    return (<ProjectedAnswers
      projector={projector}
      response={this.sortedAndJoinedAnswers()}
      sampleCorrectAnswer={sampleCorrectAnswer}
      selectedSubmissionOrder={selected_submission_order}
      selectedSubmissions={selected_submissions}
      submissions={submissions}
    />)
  }

  isSubmittable = () => {
    const { answers, } = this.state
    const { data, } = this.props
    return data.play.nBlanks === answerCount(answers)
  }

  textEditListComponents(i){
    const { projector, } = this.props
    const { answers, submittedAnswers, } = this.state
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

  answerValues(){
    // TODO use Object.values once we figure out typescript ECMA-2017
    const answerArr : Array<string|null> = [];
    const { answers, } = this.state
    for (let key in answers) {
      answerArr.push(answers[key])
    }
    return answerArr
  }

  sortedAndJoinedAnswers(){
    const sortedAnswers = this.answerValues()
    return sortedAnswers.join('; ')
  }

  handleStudentSubmission = () => {
    const { handleStudentSubmission, } = this.props
    if (this.isSubmittable() && handleStudentSubmission) {
      handleStudentSubmission(this.sortedAndJoinedAnswers())
    }
  }

  renderProjectorHeader() {
    const { projector, studentCount, submissions, mode, } = this.props

    if (!projector || mode === PROJECT) { return }

    return <ProjectorHeader studentCount={studentCount} submissions={submissions} />
  }

  renderInstructions() {
    const { submittedAnswers, } = this.state
    const { data, } = this.props

    if (!data.play.instructions && (!submittedAnswers || answerCount(submittedAnswers) === data.play.nBlanks)) { return }

    let feedback = data.play.instructions
    let feedbackType = 'default'
    if (answerCount(submittedAnswers) !== data.play.nBlanks) {
      feedback = 'Your teacher wants you to try again. Submit a new response.'
      feedbackType = 'revise-unmatched'
    }

    return (<Feedback
      feedback={(<p dangerouslySetInnerHTML={{__html: feedback}} />)}
      feedbackType={feedbackType}
    />);
  }

  renderModeSpecificContent(){
    const { submittedAnswers, } = this.state
    const { mode, data, } = this.props
    if (mode==='PROJECT') {
      return this.renderProject()
    } else {
      const submitButton = answerCount(submittedAnswers) === data.play.nBlanks ? null : <SubmitButton disabled={!this.isSubmittable()} onClick={this.handleStudentSubmission} />
      const prompt = <SentenceFragments prompt={data.play.prompt} />
      return (
        <React.Fragment>
          <PromptSection
            mode={mode}
            promptElement={prompt}
          />
          {this.renderInstructions()}
          {this.listBlanks()}
          {submitButton}
        </React.Fragment>
      )
    }
  }

  renderSubmittedBar() {
    const { submittedAnswers, } = this.state
    const { mode, data, } = this.props

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
