declare function require(name:string);
import * as React from 'react';
import * as _ from 'lodash'
import { firebase } from '../../../libs/firebase';
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
import { Feedback } from 'quill-component-library/dist/componentLibrary' 
import numberToWord from '../../../libs/numberToWord'
import { getParameterByName } from '../../../libs/getParameterByName';
const icon = require('../../../img/question_icon.svg')

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
  constructor(props) {
    super(props);
    this.state = {isSubmittable: false, answers: {}, errors: false, answerCount: 0, submitted: false}
    this.customChangeEvent = this.customChangeEvent.bind(this)
    this.handleStudentSubmission = this.handleStudentSubmission.bind(this)
  }

  toObject(answers) {
    const arr = answers.split(',')
    const objectifiedArr = {};
    for (var i = 0; i < arr.length; ++i) {
      objectifiedArr[i] = arr[i];
    }
    return objectifiedArr;
  }

  componentWillReceiveProps(nextProps) {
    const student = getParameterByName('student')
    if (student && nextProps.submissions && nextProps.submissions[student] && !this.state.submitted) {
      const submittedAnswers = {};
      const splitAnswers = nextProps.submissions[student].data.split(", ");
      for (let i = 0; i < splitAnswers.length; i++) {
        submittedAnswers[i] = splitAnswers[i]
      }
      this.setState({
        submitted: true,
        answers: submittedAnswers
      })
    }
    if (student && this.state.submitted) {
      const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
      if (!nextProps.submissions || retryForStudent) {
        // this will  reset the state when a teacher resets a question
        this.setState({ submitted: false, answers: {}, });
      } else {
        this.setState({answers: this.toObject(nextProps.submissions[student].data)})
      }
    }
  }

  customChangeEvent(e, index){
    const newState = {...this.state}
    newState.answers[index] = e
    const initialBlankCount = this.props.data.play.nBlanks;
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
      return <div>
        <p className="answer-header"><i className="fa fa-user" />Your Answer:</p>
        <p className="your-answer">{this.sortedAndJoinedAnswers()}</p>
      </div>
    }
  }

  renderClassAnswersList() {
    const { selected_submissions, submissions, selected_submission_order, data} = this.props;
    const selected = selected_submission_order ? selected_submission_order.map((key, index) => {
    let text
    if (submissions && submissions[key] && submissions[key].data) {
      text = submissions[key].data
    } else if (key === 'correct' && data.play && data.play.sampleCorrectAnswer){
      text = data.play.sampleCorrectAnswer
    } else {
      text = ''
    }
      return (
        <li key={`li-${index}`}>
        <span className='li-number'>{index + 1}</span> {text}
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

  textEditListComponents(i){
    const disabled:boolean = Boolean(!this.state.isSubmittable && this.state.submitted)
    return (
      <div className={`list-component`} key={`${i}`}>
        <span className="list-number">{`${i + 1}:`}</span>
        <TextEditor
          index={i}
          value={this.state.answers[i]}
          handleChange={this.customChangeEvent}
          hasError={this.itemHasError(i)}
          disabled={disabled}
          />
      </div>
    )
  }

  listBlanks() {
    // let { a, b }: { a: string, b: number } = o;
    const nBlanks = this.props.data.play.nBlanks;
    const textEditorArr : JSX.Element[]  = [];
    for (let i = 0; i < nBlanks; i++) {
        textEditorArr.push(
        this.textEditListComponents(i)
      )
    }
    if (!this.props.projector) {
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
    const answers = this.state.answers
    for (let key in answers) {
      answerArr.push(answers[key])
    }
    return answerArr
  }

  sortedAndJoinedAnswers(){
      const sortedAnswers = this.answerValues()
      return sortedAnswers.join(', ')
  }

  handleStudentSubmission(){
    if (this.state.isSubmittable && this.props.handleStudentSubmission) {
        this.props.handleStudentSubmission(this.sortedAndJoinedAnswers())
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
      let submitButton = !this.props.projector ? <SubmitButton key={`${this.state.isSubmittable}`} disabled={this.state.submitted || !this.state.isSubmittable} onClick={this.handleStudentSubmission}/> : null;
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
            <div style={{marginBottom: 20}}>{feedbackRow}</div>
            {submitButton}
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
