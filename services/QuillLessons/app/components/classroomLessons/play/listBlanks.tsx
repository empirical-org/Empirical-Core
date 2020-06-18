declare function require(name:string);
import * as React from 'react';
import * as _ from 'lodash'
import { Feedback } from 'quill-component-library/dist/componentLibrary'

import {
QuestionData,
} from '../../../interfaces/classroomLessons'
import {
ClassroomLessonSession,
SelectedSubmissionsForQuestion,
QuestionSubmissionsList
} from '../interfaces'
import TextEditor from '../shared/textEditor';
import SubmitButton from './submitButton'
import FeedbackRow from './feedbackRow'
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
  isSubmittable: Boolean;
  answers: { [key:string]: string };
  errors: Boolean;
  answerCount: number;
  submitted: Boolean;
}

class ListBlanks extends React.Component<ListBlankProps, ListBlankState> {
  state = {
    isSubmittable: false,
    answers: {},
    errors: false,
    answerCount: 0,
    submitted: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { submitted, } = this.state
    const student = getParameterByName('student')
    if (student && nextProps.submissions && nextProps.submissions[student] && !submitted) {
      const submittedAnswers = {};
      const splitAnswers = nextProps.submissions[student].data.split(", ");
      for (let i = 0; i < splitAnswers.length; i+=1) {
        submittedAnswers[i] = splitAnswers[i]
      }
      this.setState({
        submitted: true,
        answers: submittedAnswers
      })
    }
    if (student && submitted) {
      const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
      if (!nextProps.submissions || retryForStudent) {
        // this will  reset the state when a teacher resets a question
        this.setState({ submitted: false, answers: {}, });
      } else {
        this.setState({answers: this.toObject(nextProps.submissions[student].data)})
      }
    }
  }

  toObject(answers) {
    const arr = answers.split(',')
    const objectifiedArr = {};
    for (var i = 0; i < arr.length; i+=1) {
      objectifiedArr[i] = arr[i];
    }
    return objectifiedArr;
  }

  customChangeEvent = (e, index) =>{
    const { data, } = this.props
    const newState = {...this.state}
    newState.answers[index] = e
    const initialBlankCount = data.play.nBlanks;
    const answerCount = this.answerCount(newState.answers)
    newState.answerCount = answerCount
    if (initialBlankCount === answerCount) {
        // if this is the case then all answers are filled and we are good
        newState.isSubmittable = true
        newState.errors = false
    } else {
      // otherwise it is not submittable
      newState.isSubmittable = false
    }
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


  answerCount(answers) {
    let nonBlankAnswers = 0;
    let errorCount = 0;
    if (answers) {
        // counts the number of truthy answers or adds to empty answer count
        for (let key in answers) {
          answers[key] ? nonBlankAnswers+=1 : null
        }
    }
    return nonBlankAnswers
  }

  itemHasError(i){
    const s = this.state
    if (s.errors && !s.answers[i]) {
        return true
    }
  }

  textEditListComponents(i){
    const { isSubmittable, submitted, answers, } = this.state
    const disabled:boolean = Boolean(!isSubmittable && submitted)
    return (
      <div className="list-component" key={`${i}`}>
        <span className="list-number">{`${i + 1}.`}</span>
        <TextEditor
          disabled={disabled}
          handleChange={this.customChangeEvent}
          hasError={this.itemHasError(i)}
          index={i}
          value={answers[i]}
        />
      </div>
    )
  }

  listBlanks() {
    const { projector, data, } = this.props
    // let { a, b }: { a: string, b: number } = o;
    const nBlanks = data.play.nBlanks;
    const textEditorArr : JSX.Element[]  = [];
    for (let i = 0; i < nBlanks; i+=1) {
        textEditorArr.push(
        this.textEditListComponents(i)
      )
    }
    if (!projector) {
      return (
        <div className="list-blanks">
          {textEditorArr}
        </div>
      )
    }
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
      return sortedAnswers.join(', ')
  }

  handleStudentSubmission = () => {
    const { isSubmittable, } = this.state
    const { handleStudentSubmission, } = this.props
    if (isSubmittable && handleStudentSubmission) {
      handleStudentSubmission(this.sortedAndJoinedAnswers())
      this.setState({isSubmittable: false, submitted: true})
    } else {
      this.setState({errors: true});
    }
  }

  renderWarning(){
    const { data, } = this.props
    const { answerCount, } = this.state
    const count = numberToWord(data.play.nBlanks - answerCount);
    const suffix = count === 'one' ? '' : 's';
    return (
      <span className="warning">
        {`You missed ${count} blank${suffix}! Please fill in all blanks, then submit your answer.`}
      </span>
    );
  }

  renderModeSpecificContent(){
    const { errors, submitted, isSubmittable, } = this.state
    const { mode, data, projector, } = this.props
    if (mode==='PROJECT') {
      return this.renderProject()
    } else {
      let errorArea = errors ? this.renderWarning() : null;
      let feedbackRow = submitted ? <FeedbackRow /> : null;
      let instructionsRow = data.play.instructions ? (<Feedback
        feedback={(<p dangerouslySetInnerHTML={{__html: data.play.instructions}} />)}
        feedbackType="default"
      />) : null;
      const disabled = submitted || !isSubmittable
      return (
        <div>
          <PromptSection
            mode={mode}
            promptElement={prompt}
          />
          <h1 className="prompt">
            <div dangerouslySetInnerHTML={{__html: data.play.prompt}} />
          </h1>
          {instructionsRow}
          {this.listBlanks()}
          <div>
            <div className='feedback-and-button-container'>
              {errorArea}
              <div style={{marginBottom: 20}}>{feedbackRow}</div>
              return <SubmitButton disabled={disabled} onClick={this.handleStudentSubmission} />
            </div>
          </div>
        </div>
      )
    }
  }


  render() {
    return (
      <div className="list-blanks">
        {this.renderModeSpecificContent()}
      </div>
    );
  }

}

export default ListBlanks;
