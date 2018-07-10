declare function require(name:string);
import * as React from 'react';
const moment = require('moment');
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
import Feedback from '../../renderForQuestions/components/feedback'
import numberToWord from '../../../libs/numberToWord'
import { getParameterByName } from '../../../libs/getParameterByName';
const icon = require('../../../img/question_icon.svg')

interface MultistepProps {
  data: QuestionData;
  mode?: null|string;
  handleStudentSubmission?: Function;
  selected_submissions?: SelectedSubmissionsForQuestion|null;
  submissions?: QuestionSubmissionsList|null;
  selected_submission_order?: Array<string> | null,
  projector?: boolean|null
}
interface MultistepState {
  isSubmittable: Boolean;
  answers: { [key:string]: string };
  errors: Boolean;
  answerCount: number;
  submitted: Boolean;
}

class Multisteps extends React.Component<MultistepProps, MultistepState> {
  constructor(props) {
    super(props);

    const answerHash = {}
    props.data.play.stepLabels.forEach((sl) => answerHash[sl] = '')
    this.state = {
      isSubmittable: false,
      answers: answerHash,
      errors: false,
      answerCount: 0,
      submitted: false}
    this.customChangeEvent = this.customChangeEvent.bind(this)
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const student = getParameterByName('student')
    if (student && nextProps.submissions && nextProps.submissions[student] && !this.state.submitted) {
      this.setState({
        submitted: true,
      })
    }
    if (student && this.state.submitted) {
      const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
      if (!nextProps.submissions || retryForStudent) {
        // this will  reset the state when a teacher resets a question
        const answerHash = {}
        nextProps.data.play.stepLabels.forEach((sl) => answerHash[sl] = null)
        this.setState({ submitted: false, answers: answerHash, });
      } else {
        this.setState({answers: nextProps.submissions[student].data})
      }
    }
  }

  customChangeEvent(e, sl){
    const newState = {...this.state}
    newState.answers[sl] = e
    const initialBlankCount = this.props.data.play.stepLabels.length;
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
    const classAnswers = this.props.selected_submissions
    ? (<div>
      <p className="answer-header"><i className="fa fa-users" />Class Answers:</p>
      {this.renderClassAnswersList()}
    </div>)
    : <span />;
    return (
      <div className="display-mode">
        {this.renderYourAnswer()}
        {classAnswers}
      </div>
    );
  }

  renderYourAnswer() {
    if (!this.props.projector) {
      const studentID = getParameterByName('student')
      const data = this.props.submissions && studentID && this.props.submissions[studentID] ? this.props.submissions[studentID].data : null
      const submission: string =  data ? data : ''
      return <div>
        <p className="answer-header"><i className="fa fa-user" />Your Answer:</p>
        <p className="your-answer" dangerouslySetInnerHTML={{__html: submission}}/>
      </div>
    }
  }

  renderHTMLFromSubmissionObject(submission) {
    return Object.keys(submission).map(key => `<span><strong>${key} </strong>${submission[key]}</span>`).join(', ')
  }

  renderClassAnswersList() {
    const { selected_submissions, submissions, selected_submission_order, data} = this.props;
    const selected = selected_submission_order ? selected_submission_order.map((key, index) => {
      let html
      if (submissions && submissions[key] && submissions[key].data) {
        html = submissions[key].data
      } else if (key === 'correct' && data.play && data.play.sampleCorrectAnswer){
        html = data.play.sampleCorrectAnswer
      } else {
        html = ''
      }
        return (
          <li key={`li-${index}`}>
          <span className='li-number'>{index + 1}</span> <span dangerouslySetInnerHTML={{__html: html}}/>
          </li>);
        }) : <span/>
      return (
        <ul className="class-answer-list">
        {selected}
        </ul>
      );
  }


  answerCount(answers) {
    let nonBlankAnswers = 0;
    let errorCount = 0;
    if (answers) {
        // counts the number of truthy answers or adds to empty answer count
        for (let key in answers) {
          answers[key] ? nonBlankAnswers++ : null
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

  textEditListComponents(sl, i){
    return (
      <div className={`list-component`} key={sl}>
        <span className="list-number">{sl}</span>
        <TextEditor
          index={sl}
          value={this.state.answers[sl]}
          handleChange={this.customChangeEvent}
          hasError={this.itemHasError(sl)}
          disabled={!this.state.isSubmittable && this.state.submitted}
          />
      </div>
    )
  }

  listBlanks() {
    // let { a, b }: { a: string, b: number } = o;
    const stepLabels = this.props.data.play.stepLabels
    const nStepLabels = stepLabels.length;
    const textEditorArr : JSX.Element[]  = [];
    for (let i = 0; i < nStepLabels; i++) {
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

  handleStudentSubmission(){
    if (this.state.isSubmittable && this.props.handleStudentSubmission) {
        this.props.handleStudentSubmission(this.renderHTMLFromSubmissionObject(this.state.answers))
        this.setState({isSubmittable: false, submitted: true})
    } else {
      this.setState({errors: true});
    }
  }

  renderWarning(){
    const count = numberToWord(this.props.data.play.nBlanks - this.state.answerCount);
    const suffix = count === 'one' ? '' : 's';
    return (
      <span className="warning">
        {`You missed ${count} blank${suffix}! Please fill in all blanks, then submit your answer.`}
      </span>
    );
  }

  renderModeSpecificContent(){
    if (this.props.mode==='PROJECT') {
      return this.renderProject()
    } else {
      let errorArea = this.state.errors ? this.renderWarning() : null;
      let feedbackRow = this.state.submitted ? <FeedbackRow/> : null;
      let instructionsRow = this.props.data.play.instructions ? (<Feedback 
        feedbackType="default"
        feedback={(<p dangerouslySetInnerHTML={{__html: this.props.data.play.instructions}}></p>)}
      />) : null;
      return (
        <div>
        <h1 className="prompt">
          <div dangerouslySetInnerHTML={{__html: this.props.data.play.prompt}}/>
        </h1>
        {instructionsRow}
        {this.listBlanks()}
        <div>
          <div className='feedback-and-button-container'>
            {errorArea}
            <div style={{marginBottom: 20}}>
            {feedbackRow}
            </div>
            <SubmitButton key={`${this.state.isSubmittable}`} disabled={this.state.submitted || !this.state.isSubmittable} onClick={this.handleStudentSubmission}/>
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

export default Multisteps;
