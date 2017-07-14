declare function require(name:string);
import * as React from 'react';
const moment = require('moment');
import {
QuestionData,
} from 'interfaces/classroomLessons'
import {
ClassroomLessonSession,
SelectedSubmissionsForQuestion,
QuestionSubmissionsList
} from '../interfaces'
import TextEditor from '../../renderForQuestions/renderTextEditor';
import SubmitButton from './submitButton'
import FeedbackRow from './feedbackRow'
import numberToWord from '../../../libs/numberToWord'

interface ListBlankProps {
  data: QuestionData;
  mode: null|string;
  handleStudentSubmission: Function;
  selected_submissions: SelectedSubmissionsForQuestion|null;
  submissions: QuestionSubmissionsList|null;
}
interface ListBlankState {
  isSubmittable: Boolean;
  answers: { [key:string]: string|null };
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
        <p className="answer-header"><i className="fa fa-user" />Your Answer:</p>
        {this.renderYourAnswer()}
        {classAnswers}
      </div>
    );
  }

  renderYourAnswer() {
    return <p className="your-answer">bleh</p>;
  }

  renderClassAnswersList() {
    const { selected_submissions, submissions, } = this.props;
    const selected = Object.keys(selected_submissions).map((key, index) => {
      const text = submissions ? submissions[key].data : null
      return (<li>
        <span>{index + 1}</span>{text}
      </li>);
    });
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
    return (
      <div className={`list-component`} key={`list-component-${i}`}>
        <span className="list-number">{`Word ${i + 1}:`}</span>
        <TextEditor
          editorIndex={i}
          handleChange={this.customChangeEvent}
          hasError={this.itemHasError(i)}
          disabled={!this.state.isSubmittable && this.state.submitted}
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
    return (
      <div className="list-blanks">
        {textEditorArr}
      </div>
    )
  }

  answerValues(){
    // TODO use Object.values once we figure out typescript ECMA-2017
    const answerArr : string[] = [];
    const vals = this.state.answers
    for (let key in vals) {
      answerArr.push(key)
    }
    return answerArr
  }

  handleStudentSubmission(){
    if (this.state.isSubmittable) {
        const sortedAnswers = this.answerValues().sort()
        this.props.handleStudentSubmission(sortedAnswers.join(', '), moment().format())
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
      let feedbackRow = this.state.submitted ? <FeedbackRow/> : null
      return (
        <div>
        <h1 className="prompt">
          {this.props.data.play.prompt}
        </h1>
        {this.listBlanks()}
        <div>
          <div className='feedback-and-button-container'>
            {errorArea}
            {feedbackRow}
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

export default ListBlanks;
