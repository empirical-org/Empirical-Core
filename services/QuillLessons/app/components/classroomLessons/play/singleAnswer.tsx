declare function require(name:string);
import React, { Component } from 'react';
import Cues from '../../../components/renderForQuestions/cues';
import FeedbackRow from './feedbackRow'
import {
  Feedback,
  SentenceFragments
} from 'quill-component-library/dist/componentLibrary'
import TextEditor from '../../renderForQuestions/renderTextEditor';
import { getParameterByName } from '../../../libs/getParameterByName';
import { firebase } from '../../../libs/firebase';
import {
  QuestionSubmissionsList,
  SelectedSubmissionsForQuestion,
} from '../interfaces';
import { QuestionData } from '../../../interfaces/classroomLessons'

const laptopGlyphSrc = `${process.env.QUILL_CDN_URL}/images/icons/laptop-glyph.svg` ;

const PROJECT = 'PROJECT'

interface SingleAnswerProps {
  data: QuestionData,
  handleStudentSubmission?: Function,
  mode?: string|null,
  submissions?: QuestionSubmissionsList|null,
  selected_submissions?: SelectedSubmissionsForQuestion|null,
  selected_submission_order?: Array<string>|null,
  projector?: boolean|null,
  studentCount?: number
}

interface SingleAnswerState {
  response: string|null,
  editing: boolean,
  submitted: boolean,
  showPrompt: boolean
}

class SingleAnswer extends Component<SingleAnswerProps, SingleAnswerState> {
  constructor(props) {
    super(props);
    const student = getParameterByName('student');
    const { submissions, data, } = props
    this.state = {
      response: student && submissions && submissions[student] ?
                submissions[student].data :
                data.play.prefilledText,
      editing: false,
      submitted: student && submissions && submissions[student],
      showPrompt: true
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { editing, submitted, response, } = this.state
    const student = getParameterByName('student');
    if (student && nextProps.submissions && nextProps.submissions[student] && !submitted) {
      this.setState({ submitted: true, response: nextProps.submissions[student].data })
    }
    // this will reset the state when a teacher resets a question
    const retryForStudent = student && nextProps.submissions && !nextProps.submissions[student];
    if (submitted && (nextProps.submissions === null || retryForStudent)) {
      this.setState({ submitted: false, editing: false, response: nextProps.data.play.prefilledText || '', });
    }
    if (!editing && !submitted && (nextProps.data.play.prefilledText !== response)) {
      this.setState({response: nextProps.data.play.prefilledText})
    }
  }

  handleSubmit = () => {
    const { handleStudentSubmission, } = this.props
    const { response, } = this.state

    if (!handleStudentSubmission) { return }

    handleStudentSubmission(response);
    this.setState({ submitted: true, });
  }

  onChange = (e) => {
    this.setState({ editing: e.length, response: e, });
  }

  handleShowPromptButtonClick = () => {
    this.setState(prevState => ({ showPrompt: !prevState.showPrompt, }))
  }

  // this is the mode where the teacher has chosen to project some of the students'
  // answers, NOT what is being projected on the board.
  renderProject() {
    const { selected_submissions, selected_submission_order, } = this.props
    let classAnswers
    if (selected_submissions && selected_submission_order) {
      classAnswers = (<div>
        <p className="answer-header">Class responses</p>
        {this.renderClassAnswersList()}
      </div>)
    }
    return (
      <div className="display-mode">
        {this.renderYourAnswer()}
        {classAnswers}
      </div>
    );
  }

  renderYourAnswer() {
    const { projector, } = this.props
    const { response, } = this.state

    if (projector || !response) { return }

    return (<div>
      <p className="answer-header">Your response</p>
      <p className="your-answer">{response}</p>
    </div>)
  }

  renderClassAnswersList() {
    const { submissions, selected_submission_order, data} = this.props;
    const selected = selected_submission_order ? selected_submission_order.map((key, index) => {
      let text
      if (submissions && submissions[key] && submissions[key].data) {
        text = submissions[key].data
      } else if (key === 'correct' && data.play && data.play.sampleCorrectAnswer){
        text = data.play.sampleCorrectAnswer
      } else {
        text = ''
      }
      return <li key={index}>{text}</li>
    }) : null;
    return (
      <ol className="class-answer-list">
        {selected}
      </ol>
    );
  }

  modeAppropriateRender() {
    const { mode, projector, } = this.props
    const { submitted, response, } = this.state

    if (mode === PROJECT) { return this.renderProject(); }

    const textBoxDisabled = !!submitted || projector
    const value = projector ? 'Students type responses here' : response
    return (
      <TextEditor
        checkAnswer={this.handleSubmit}
        defaultValue=""
        disabled={textBoxDisabled}
        handleChange={this.onChange}
        hasError={undefined}
        placeholder="Type your response here"
        value={value}
      />
    );
  }

  renderInstructions() {
    const { mode, data, } = this.props

    if (mode === PROJECT || !data.play.instructions) { return }

    return (<Feedback
      feedback={(<p dangerouslySetInnerHTML={{__html: data.play.instructions}} />)}
      feedbackType="default"
    />);
  }

  renderCues() {
    const { mode, data, } = this.props

    if (mode === PROJECT) { return }

    const getQuestion = () => ({ cues: data.play.cues })

    if (data.play.cues) {
      return (
        <Cues
          displayArrowAndText={false}
          getQuestion={getQuestion}
        />
      );
    }
    return (
      <span />
    );
  }

  renderSubmitButton() {
    const { mode, } = this.props
    const { response, submitted, } = this.state
    if (submitted || mode === PROJECT) { return }

    const disabled = !response || response.length === 0 ? 'disabled' : null
    return (<div className="question-button-group">
      <button className={`quill-button primary contained large focus-on-light ${disabled}`} disabled={!!disabled} onClick={this.handleSubmit} type="button">Submit</button>
    </div>);
  }

  renderProjectorHeader() {
    const { projector, studentCount, submissions, mode, } = this.props

    if (!projector || mode === PROJECT) { return }

    const submissionCount:number = submissions ? Object.keys(submissions).length : 0
    const studentCountText:string = studentCount ? `${submissionCount} of ${studentCount} have responded` : ''
    return (<div className="projector-header-section">
      <div className="students-type-tag tag"><img alt="Laptop Icon" src={laptopGlyphSrc} /><span>Students type response</span></div>
      <p className="answered-count">{studentCountText}</p>
    </div>)
  }

  renderSubmittedBar() {
    const { mode, } = this.props
    const { submitted, } = this.state

    if (!submitted || mode === PROJECT) { return }

    return <div className="submitted-bar">Please wait as your teacher reviews your response.</div>
  }

  renderPrompt() {
    const { showPrompt, } = this.state
    const { data, mode, } = this.props

    const prompt = <SentenceFragments prompt={data.play.prompt} />

    if (mode !== PROJECT) { return prompt }

    if (showPrompt) {
      return (<React.Fragment>
        {prompt}
        <div className="display-answers-divider prompt-showing">
          <div className="display-answers-divider-content">
            <button onClick={this.handleShowPromptButtonClick} type="button">Hide</button>
          </div>
        </div>
      </React.Fragment>)
    }

    return (<div className="display-answers-divider prompt-hidden">
      <div className="display-answers-divider-content">
        <button onClick={this.handleShowPromptButtonClick} type="button">Show</button>
      </div>
    </div>)
  }

  render() {
    const { projector, } = this.props
    const { editing, } = this.state
    let className = 'single-answer '
    className+= projector ? "projector " : ""
    className+= editing ? "editing " : ""

    return (
      <div className={className}>
        {this.renderProjectorHeader()}
        {this.renderPrompt()}
        {this.renderCues()}
        {this.renderInstructions()}
        {this.modeAppropriateRender()}
        {this.renderSubmitButton()}
        {this.renderSubmittedBar()}
      </div>
    );
  }
}

export default SingleAnswer;
