declare function require(name:string);
import * as React from 'react';
import Cues from '../../renderForQuestions/cues';
import FeedbackRow from './feedbackRow'
import {
  Feedback,
  SentenceFragments,
} from '../../../../Shared/index'

import TextEditor from '../../renderForQuestions/renderTextEditor';
import { getParameterByName } from '../../../libs/getParameterByName';
import ProjectorHeader from './projectorHeader'
import ProjectedAnswers from './projectedAnswers'
import PromptSection from './promptSection'
import SubmitButton from './submitButton'
import { PROJECT } from './constants'
import {
  QuestionSubmissionsList,
  SelectedSubmissionsForQuestion,
} from '../interfaces';
import { QuestionData } from '../../../interfaces/classroomLessons'

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
}

class SingleAnswer extends React.Component<SingleAnswerProps, SingleAnswerState> {
  constructor(props) {
    super(props);
    const student = getParameterByName('student');
    const { submissions, data, } = props
    this.state = {
      response: student && submissions && submissions[student] ?
        submissions[student].data :
        data.play.prefilledText,
      editing: false,
      submitted: student && submissions && submissions[student]
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

  // this is the mode where the teacher has chosen to project some of the students'
  // answers, NOT what is being projected on the board.
  renderProject() {
    const { selected_submissions, selected_submission_order, data, projector, submissions, } = this.props
    const { response, } = this.state
    const { sampleCorrectAnswer, } = data.play

    return (
      <ProjectedAnswers
        projector={projector}
        response={response}
        sampleCorrectAnswer={sampleCorrectAnswer}
        selectedSubmissionOrder={selected_submission_order}
        selectedSubmissions={selected_submissions}
        submissions={submissions}
      />
    )
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

    return (
      <Feedback
        feedback={(<p dangerouslySetInnerHTML={{__html: data.play.instructions}} />)}
        feedbackType="default"
      />
    );
  }

  renderCues() {
    const { mode, data, } = this.props

    if (mode === PROJECT || !data.play.cues) { return }

    return (
      <Cues
        cues={data.play.cues}
        displayArrowAndText={false}
      />
    );
  }

  renderSubmitButton() {
    const { mode, } = this.props
    const { response, submitted, } = this.state
    if (submitted || mode === PROJECT) { return }

    const disabled = !response || response.length === 0
    return <SubmitButton disabled={disabled} onClick={this.handleSubmit} />
  }

  renderSubmittedBar() {
    const { mode, } = this.props
    const { submitted, } = this.state

    if (!submitted || mode === PROJECT) { return }

    return <div className="submitted-bar">Please wait as your teacher reviews your response.</div>
  }

  renderPrompt() {
    const { data, mode, } = this.props

    const prompt = <SentenceFragments prompt={data.play.prompt} />

    return (
      <PromptSection
        mode={mode}
        promptElement={prompt}
      />
    )
  }

  renderProjectorHeader() {
    const { projector, studentCount, submissions, mode, } = this.props

    if (!projector || mode === PROJECT) { return }

    return <ProjectorHeader studentCount={studentCount} submissions={submissions} />
  }

  render() {
    const { projector, } = this.props
    const { editing, } = this.state
    let className = 'student-slide-wrapper single-answer '
    className+= projector ? "projector " : ""
    className+= editing ? "editing " : ""

    return (
      <div className={className}>
        <div className="all-but-submitted-bar">
          {this.renderProjectorHeader()}
          {this.renderPrompt()}
          {this.renderCues()}
          {this.renderInstructions()}
          {this.modeAppropriateRender()}
          {this.renderSubmitButton()}
        </div>
        {this.renderSubmittedBar()}
      </div>
    );
  }
}

export default SingleAnswer;
