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

      return (<div className={className} key={sl}>
        <p className="step-label">{sl}</p>
        <ProjectedAnswers
          {...commonProps}
          response={response}
          selectedSubmissionOrder={selectedSubmissionOrder}
          selectedSubmissions={selectedSubmissions}
        />
      </div>)
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
    if (answerCount(submittedAnswers) !== data.play.stepLabels.length) {
      feedback = 'Your teacher wants you to try again. Submit a new response.'
      feedbackType = 'revise-unmatched'
    }

    return (<Feedback
      feedback={(<p dangerouslySetInnerHTML={{__html: feedback}} />)}
      feedbackType={feedbackType}
    />);
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
      return (<React.Fragment>
        {promptSection}
        {this.renderProjectedAnswers()}
      </React.Fragment>)
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

export default ListBlanks;


// declare function require(name:string);
// import * as React from 'react';
// const moment = require('moment');
// import {
// QuestionData,
// } from '../../../interfaces/classroomLessons'
// import {
// ClassroomLessonSession,
// SelectedSubmissionsForQuestion,
// QuestionSubmissionsList
// } from '../interfaces'
// import TextEditor from '../shared/textEditor';
// import SubmitButton from './submitButton'
// import FeedbackRow from './feedbackRow'
// import { Feedback } from 'quill-component-library/dist/componentLibrary'
// import numberToWord from '../../../libs/numberToWord'
// import { getParameterByName } from '../../../libs/getParameterByName';
// const icon = 'https://assets.quill.org/images/icons/question_icon.svg'
//
// interface MultistepProps {
//   data: QuestionData;
//   mode?: null|string;
//   handleStudentSubmission?: Function;
//   selected_submissions?: SelectedSubmissionsForQuestion|null;
//   submissions?: QuestionSubmissionsList|null;
//   selected_submission_order?: Array<string> | null,
//   projector?: boolean|null
// }
// interface MultistepState {
//   isSubmittable: Boolean;
//   answers: { [key:string]: string };
//   errors: Boolean;
//   answerCount: number;
//   submitted: Boolean;
// }
//
// class Multisteps extends React.Component<MultistepProps, MultistepState> {
//   constructor(props) {
//     super(props);
//
//     const answerHash = {}
//     props.data.play.stepLabels.forEach((sl) => answerHash[sl] = '')
//     this.state = {
//       isSubmittable: false,
//       answers: answerHash,
//       errors: false,
//       answerCount: 0,
//       submitted: false
//     }
//   }
//
//   UNSAFE_componentWillReceiveProps(nextProps) {
//     const student = getParameterByName('student')
//     if (student && nextProps.submissions && nextProps.submissions[student] && !this.state.submitted) {
//       this.setState({
//         submitted: true,
//       })
//     }
//     if (student && this.state.submitted) {
//       const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
//       if (!nextProps.submissions || retryForStudent) {
//         // this will  reset the state when a teacher resets a question
//         const answerHash = {}
//         nextProps.data.play.stepLabels.forEach((sl) => answerHash[sl] = null)
//         this.setState({ submitted: false, answers: answerHash, });
//       } else {
//         this.setState({answers: nextProps.submissions[student].data})
//       }
//     }
//   }
//
//   customChangeEvent = (e, sl) => {
//     const newState = {...this.state}
//     newState.answers[sl] = e
//     const initialBlankCount = this.props.data.play.stepLabels.length;
//     const answerCount = this.answerCount(newState.answers)
//     newState.answerCount = answerCount
//     if (initialBlankCount === answerCount) {
//         // if this is the case then all answers are filled and we are good
//         newState.isSubmittable = true
//         newState.errors = false
//     } else {
//       // otherwise it is not submittable
//       newState.isSubmittable = false
//     }
//     this.setState(newState)
//   }
//
//   renderProject() {
//     const classAnswers = this.props.selected_submissions
//     ? (<div>
//       <p className="answer-header"><i className="fa fa-users" />Class Answers:</p>
//       {this.renderClassAnswersList()}
//     </div>)
//     : <span />;
//     return (
//       <div className="display-mode">
//         {this.renderYourAnswer()}
//         {classAnswers}
//       </div>
//     );
//   }
//
//   renderYourAnswer() {
//     if (!this.props.projector) {
//       const studentID = getParameterByName('student')
//       const data = this.props.submissions && studentID && this.props.submissions[studentID] ? this.props.submissions[studentID].data : null
//       const submission: string =  data ? data : ''
//       return (<div>
//         <p className="answer-header"><i className="fa fa-user" />Your Answer:</p>
//         <p className="your-answer" dangerouslySetInnerHTML={{__html: submission}} />
//       </div>)
//     }
//   }
//
//   renderHTMLFromSubmissionObject(submission) {
//     return Object.keys(submission).map(key => `<span><strong>${key} </strong>${submission[key]}</span>`).join(', ')
//   }
//
//   renderClassAnswersList() {
//     const { selected_submissions, submissions, selected_submission_order, data} = this.props;
//     const selected = selected_submission_order ? selected_submission_order.map((key, index) => {
//       let html
//       if (submissions && submissions[key] && submissions[key].data) {
//         html = submissions[key].data
//       } else if (key === 'correct' && data.play && data.play.sampleCorrectAnswer){
//         html = data.play.sampleCorrectAnswer
//       } else {
//         html = ''
//       }
//         return (
//           <li key={`li-${index}`}>
//             <span className='li-number'>{index + 1}</span> <span dangerouslySetInnerHTML={{__html: html}} />
//           </li>);
//         }) : <span />
//       return (
//         <ul className="class-answer-list">
//           {selected}
//         </ul>
//       );
//   }
//
//
//   answerCount(answers) {
//     let nonBlankAnswers = 0;
//     let errorCount = 0;
//     if (answers) {
//         // counts the number of truthy answers or adds to empty answer count
//         for (let key in answers) {
//           answers[key] ? nonBlankAnswers+=1 : null
//         }
//     }
//     return nonBlankAnswers
//   }
//
//   itemHasError(i){
//     const s = this.state
//     if (s.errors && !s.answers[i]) {
//         return true
//     }
//   }
//
//   textEditListComponents(sl, i){
//     return (
//       <div className={`list-component`} key={sl}>
//         <span className="list-number">{sl}</span>
//         <TextEditor
//           disabled={!this.state.isSubmittable && this.state.submitted}
//           handleChange={this.customChangeEvent}
//           hasError={this.itemHasError(sl)}
//           index={sl}
//           value={this.state.answers[sl]}
//         />
//       </div>
//     )
//   }
//
//   listBlanks() {
//     // let { a, b }: { a: string, b: number } = o;
//     const stepLabels = this.props.data.play.stepLabels
//     const nStepLabels = stepLabels.length;
//     const textEditorArr : JSX.Element[]  = [];
//     for (let i = 0; i < nStepLabels; i+=1) {
//         textEditorArr.push(
//         this.textEditListComponents(stepLabels[i], i)
//       )
//     }
//     return (
//       <div className="list-blanks">
//         {textEditorArr}
//       </div>
//     )
//   }
//
//   handleStudentSubmission = () => {
//     if (this.state.isSubmittable && this.props.handleStudentSubmission) {
//         this.props.handleStudentSubmission(this.renderHTMLFromSubmissionObject(this.state.answers))
//         this.setState({isSubmittable: false, submitted: true})
//     } else {
//       this.setState({errors: true});
//     }
//   }
//
//   renderWarning(){
//     const count = numberToWord(this.props.data.play.nBlanks - this.state.answerCount);
//     const suffix = count === 'one' ? '' : 's';
//     return (
//       <span className="warning">
//         {`You missed ${count} blank${suffix}! Please fill in all blanks, then submit your answer.`}
//       </span>
//     );
//   }
//
//   renderModeSpecificContent(){
//     if (this.props.mode==='PROJECT') {
//       return this.renderProject()
//     } else {
//       let errorArea = this.state.errors ? this.renderWarning() : null;
//       let feedbackRow = this.state.submitted ? <FeedbackRow /> : null;
//       let instructionsRow = this.props.data.play.instructions ? (<Feedback
//         feedback={(<p dangerouslySetInnerHTML={{__html: this.props.data.play.instructions}} />)}
//         feedbackType="default"
//       />) : null;
//       return (
//         <div>
//           <h1 className="prompt">
//             <div dangerouslySetInnerHTML={{__html: this.props.data.play.prompt}} />
//           </h1>
//           {instructionsRow}
//           {this.listBlanks()}
//           <div>
//             <div className='feedback-and-button-container'>
//               {errorArea}
//               <div style={{marginBottom: 20}}>
//                 {feedbackRow}
//               </div>
//               <SubmitButton disabled={this.state.submitted || !this.state.isSubmittable} key={`${this.state.isSubmittable}`} onClick={this.handleStudentSubmission} />
//             </div>
//           </div>
//         </div>
//       )
//     }
//   }
//
//
//   render() {
//     return (
//       <div className="list-blanks">
//         {this.renderModeSpecificContent()}
//       </div>
//     );
//   }
//
// }
//
// export default Multisteps;
