declare function require(name:string);
import * as React from 'react'
import * as moment from 'moment'

import { sortByLastName, sortByDisplayed, sortByTime, sortByFlag, sortByAnswer } from './studentSorts'
import ReviewStudentRow from './reviewStudentRow'
import MultipleTextEditor from './multipleTextEditor'
import StepHtml from './stepHtml'
import Cues from '../../renderForQuestions/cues';
import { findDifferences } from './findDifferences'
import { textEditorInputNotEmpty, textEditorInputClean } from './textEditorClean'
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  Presence,
  Students,
  Submissions,
  Modes,
  FlaggedStudents,
  Timestamps,
} from '../interfaces';
import {
  ScriptItem
} from '../../../interfaces/classroomLessons'
const uncheckedGrayCheckbox = 'https://assets.quill.org/images/icons/box_gray_unchecked.svg'
const checkedGrayCheckbox = 'https://assets.quill.org/images/icons/box_gray_checked.svg'
const uncheckedGreenCheckbox = 'https://assets.quill.org/images/icons/box_green_unchecked.svg'
const checkedGreenCheckbox = 'https://assets.quill.org/images/icons/box_green_checked.svg'
const grayFlag = 'https://assets.quill.org/images/icons/flag_gray.svg'
const blueFlag = 'https://assets.quill.org/images/icons/flag_blue.svg'

interface ScriptContainerProps {
  script: Array<ScriptItem>,
  onlyShowHeaders?: boolean,
  updateToggledHeaderCount?: Function,
  [key: string]: any,
}

interface ScriptContainerState {
  projecting: boolean,
  showAllStudents: boolean,
  sort: string,
  sortDirection: string,
  model: string,
  showDifferences: boolean,
  prompt: string,
}

const calculateElapsedMilliseconds = (submittedTimestamp, timestamps, currentSlide): number => {
  return submittedTimestamp.diff(moment(timestamps[currentSlide]))
}

class ScriptContainer extends React.Component<ScriptContainerProps, ScriptContainerState> {

  constructor(props) {
    super(props);

    const { current_slide, models, prompt, modes, lessonPrompt, } = this.props
    const current = current_slide;
    const modelNotEmpty = models && textEditorInputNotEmpty(models[current]);
    const promptNotEmpty = textEditorInputNotEmpty(prompt);
    this.state = {
      projecting: modes && (modes[current_slide] === "PROJECT") ? true : false,
      showAllStudents: false,
      sort: 'lastName',
      sortDirection: 'desc',
      showDifferences: false,
      model: modelNotEmpty ? textEditorInputClean(models[current]) : '',
      prompt: promptNotEmpty ?  textEditorInputClean(prompt) : textEditorInputClean(lessonPrompt)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState( {
      projecting: nextProps.modes && (nextProps.modes[nextProps.current_slide] === "PROJECT") ? true : false
    })
    if (this.props.current_slide !== nextProps.current_slide) {
      const models = nextProps.models;
      const current = nextProps.current_slide;
      const modelNotEmpty = models && textEditorInputNotEmpty(models[current]);
      const prompt = nextProps.prompt;
      const promptNotEmpty = textEditorInputNotEmpty(prompt);
      this.setState({ model: modelNotEmpty ? textEditorInputClean(models[current]) : '',
        prompt: promptNotEmpty ? textEditorInputClean(prompt) : textEditorInputClean(nextProps.lessonPrompt),
        showDifferences: false
      })
    }

    if (nextProps.submissions && nextProps.submissions[nextProps.current_slide]) {
      const numStudents: number = Object.keys(nextProps.presence).length;
      const numAnswers: number = Object.keys(nextProps.submissions[nextProps.current_slide]).length
      const percentageOfClassAnswered = numAnswers/numStudents * 100
      if (percentageOfClassAnswered > 66) {
        this.setState({showAllStudents: true})
      }
    }
  }

  renderScript(script: Array<ScriptItem>) {
    return script.map((item, index) => {
      switch(item.type) {
        case 'T-REVIEW':
          return this.renderReview(index);
        case 'STEP-HTML':
          return (
            <StepHtml
              isTip={false}
              item={item}
              key={index}
              onlyShowHeaders={this.props.onlyShowHeaders}
              updateToggledHeaderCount={this.props.updateToggledHeaderCount}
            />
          )
        case 'STEP-HTML-TIP':
          return (
            <StepHtml
              isTip={true}
              item={item}
              key={index}
              onlyShowHeaders={this.props.onlyShowHeaders}
              updateToggledHeaderCount={this.props.updateToggledHeaderCount}
            />
          )
        case 'T-MODEL':
          return this.renderTeacherModel()
        case 'Overview':
          const html:string = item && item.data && item.data.body ? item.data.body : ''
          return <div className="lobby-text" dangerouslySetInnerHTML={{__html: html}}  />
        default:
          return <li key={index}>Unsupported type</li>
      }
    });
  }

  startDisplayingAnswers = () => {
    const { startDisplayingAnswers, } = this.props
    this.setState({projecting: true})
    startDisplayingAnswers();
  }

  toggleShowAllStudents = () => {
    this.setState(prevState => ({showAllStudents: !prevState.showAllStudents}))
  }

  toggleShowDifferences = () => {
    this.setState(prevState => ({showDifferences: !prevState.showDifferences}))
  }

  stopDisplayingAnswers = () => {
    const { stopDisplayingAnswers, } = this.props
    this.setState({projecting: false})
    stopDisplayingAnswers();
  }

  renderRetryQuestionButton() {
    return <button className="interactive-wrapper focus-on-light" onClick={this.retryQuestion} type="button"><i className="fa fa-refresh" />Retry Question</button>
  }

  retryQuestion = () => {
    this.stopDisplayingAnswers()
    this.clearSelectedSubmissions()
    this.clearAllSubmissions()
  }

  retryQuestionForStudent = (student, submission) => {
    const { current_slide, submissions, clearStudentSubmission, } = this.props
    if (!submission && submissions && submissions[current_slide] && Object.keys(submissions[current_slide]).length === 1) {
      this.retryQuestion()
    } else if (submissions && submissions[current_slide] && submissions[current_slide][student]) {
      clearStudentSubmission(current_slide, student, submission)
    }
  }

  renderDisplayButton() {
    if (this.state.projecting) {
      return (
        <button className="show-prompt-button " onClick={this.stopDisplayingAnswers}>Stop Displaying Answers</button>
      )
    } else {
      const selected_submissions: SelectedSubmissions = this.props.selected_submissions;
      const current_slide: string = this.props.current_slide;
      let buttonInactive: boolean = true;
      let buttonClass: string = "inactive";
      if (selected_submissions && selected_submissions[current_slide]) {
        buttonInactive = false;
        buttonClass = "active";
      }
      return (
        <button className={"display-button " + buttonClass} disabled={buttonInactive} onClick={this.startDisplayingAnswers}>Display Selected Answers</button>
      )
    }
  }

  renderShowRemainingStudentsButton() {
    const submissions: Submissions = this.props.submissions;
    const current_slide: string = this.props.current_slide;
    const numAnswers: number = Object.keys(submissions[current_slide]).length;
    const verb: string = this.state.showAllStudents ? "Hide" : "Show";
    if (numAnswers > 0) {
      return (
        <span className="show-remaining-students-button" onClick={this.toggleShowAllStudents}> {verb} Remaining Students</span>
      )
    }
  }

  // TODO: decide whether we want to hang on to this method at all. right now it's not being called.
  renderShowDifferencesButton() {
    const shouldShowDifferences = this.props.lessonPrompt && (this.props.slideType === "CL-SA")
    if (shouldShowDifferences) {
      const verb: string = this.state.showDifferences ? "Hide" : "Show";
      return (
        <span className="show-differences-button" onClick={this.toggleShowDifferences}> {verb} Differences</span>
      )
    }
  }

  renderUnselectAllButton() {
    const { selected_submissions, current_slide } = this.props;
    if (selected_submissions && selected_submissions[current_slide]) {
      return <button className="interactive-wrapper focus-on-light" onClick={this.clearSelectedSubmissions} type="button">Unselect All</button>
    } else {
      return <p />
    }
  }

  clearSelectedSubmissions = () => {
    const { clearAllSelectedSubmissions, current_slide, } = this.props
    clearAllSelectedSubmissions(current_slide)
  }

  clearAllSubmissions() {
    const { clearAllSubmissions, current_slide, } = this.props
    clearAllSubmissions(current_slide)
  }

  setSort(sort: string) {
    if (this.state.sort !== sort) {
      this.setState({sort, sortDirection: 'desc'})
    } else {
      const sortDirection = this.state.sortDirection === 'desc' ? 'asc' : 'desc'
      this.setState({sortDirection})
    }
  }

  sortedRows(studentsToBeSorted: Array<string>) {
    const {submissions, selected_submissions, current_slide, students, flaggedStudents, timestamps, } = this.props
    const sortedRows = studentsToBeSorted.sort((studentKey1, studentKey2) => {
      switch(this.state.sort) {
        case 'flag':
          if (flaggedStudents) {
            const studentFlag1 = flaggedStudents[studentKey1] ? flaggedStudents[studentKey1] : false
            const studentFlag2 = flaggedStudents[studentKey2] ? flaggedStudents[studentKey2] : false
            return sortByFlag(studentFlag1, studentFlag2)
          }
        case 'responses':
          const answer1 = submissions[current_slide][studentKey1].data
          const answer2 = submissions[current_slide][studentKey2].data
          return sortByAnswer(answer1, answer2)
        case 'time':
          const time1 = calculateElapsedMilliseconds(moment(submissions[current_slide][studentKey1].timestamp), timestamps, current_slide)
          const time2 = calculateElapsedMilliseconds(moment(submissions[current_slide][studentKey2].timestamp), timestamps, current_slide)
          return sortByTime(time1, time2)
        case 'displayed':
          if (selected_submissions && selected_submissions[current_slide]) {
            return sortByDisplayed(selected_submissions[current_slide][studentKey1], selected_submissions[current_slide][studentKey2])
          }
        case 'lastName':
        default:
          return sortByLastName(studentKey1, studentKey2, students)
      }
    })

    return this.state.sortDirection === 'desc' ? sortedRows : sortedRows.reverse()
  }

  renderCorrectAnswerRow() {
    const selected_submissions: SelectedSubmissions = this.props.selected_submissions;
    const selected_submission_order = this.props.selected_submission_order
    const current_slide: string = this.props.current_slide;
    const checked: boolean = selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide]['correct'] : false
    const checkbox = this.determineCheckbox(checked)
    const studentNumber: number | null = checked === true && selected_submission_order && selected_submission_order[current_slide] ? selected_submission_order[current_slide].indexOf('correct') + 1 : null
    const studentNumberClassName: string = checked === true ? 'answer-number' : ''

    return (
      <tr className="sample-correct-answer-row">
        <td colSpan={2}><div>Sample Correct Response</div></td>
        <td><span dangerouslySetInnerHTML={{__html: this.props.sampleCorrectAnswer}} /></td>
        <td />
        <td>
          <input
            defaultChecked={checked}
            id="correct"
            name="correct"
            onClick={(e) => { this.props.toggleSelected(e, current_slide, 'correct'); }}
            type="checkbox"
          />
          <label htmlFor="correct">
            {checkbox}
          </label>
        </td>
        <td><span className={`answer-number-container ${studentNumberClassName}`}>{studentNumber}</span></td>
        <td />

      </tr>
    )
  }

  renderReview(index: number) {
    const { selected_submissions, submissions, current_slide, students, presence, sampleCorrectAnswer } = this.props;
    const numStudents: number = presence ? Object.keys(presence).length : 0;
    const correctAnswerRow = sampleCorrectAnswer ? this.renderCorrectAnswerRow() : <span />
    if (submissions && submissions[current_slide]) {
      const numAnswers: number = Object.keys(submissions[current_slide]).length;

      return (
        <li className="student-submission-item" key={index}>
          <div className="student-submission-item-header">
            <strong>{numAnswers} of {numStudents}</strong> students have responded.
            {this.renderShowRemainingStudentsButton()}
          </div>
          <div className="student-submission-item-table">
            <table>
              {this.renderTableHeaders()}
              <tbody>
                {correctAnswerRow}
                {this.renderStudentRows()}
              </tbody>
            </table>
          </div>

          <div className="student-submission-item-footer">
            {this.renderRetryQuestionButton()}
            {this.renderDisplayButton()}

          </div>

        </li>
      );
    } else {
      return this.renderNoSubmissionsTable(numStudents, index)
    }
  }

  renderSampleCorrectAnswer() {
    if (this.props.sampleCorrectAnswer) {
      return <div className="sample-correct-answer"><span>Sample Correct Response</span><span dangerouslySetInnerHTML={{__html: this.props.sampleCorrectAnswer}} /></div>
    } else {
      return <span />
    }
  }

  renderTableHeaders() {
    const sort = this.state.sort
    const dir = this.state.sortDirection
    const fields = {
      'lastName': 'Students',
      'flag': 'Flag',
      'responses': 'Responses',
      'time': 'Time',
      'displayed': 'Select to Display',
      'order': 1,
      'retry': 'Have Student Retry',
    }
    const headers: Array<JSX.Element> = []
    for (let key in fields) {
      if (key === 'retry') {
        headers.push(<th key={key}>{fields[key]}</th>)
      } else if (key === 'order') {
        headers.push(<th className="hidden-order" key={key}>{fields[key]}</th>)
      } else {
        let caret = sort === key && dir === 'asc' ? 'fa-caret-up' : 'fa-caret-down'
        const header = key === 'displayed'
          ? <th key={key}><span onClick={() => this.setSort(key)}>{fields[key]}<i className={`fa ${caret}`} /></span>{this.renderUnselectAllButton()}</th>
          : <th key={key}><span onClick={() => this.setSort(key)}>{fields[key]}<i className={`fa ${caret}`} /></span></th>
        headers.push(header)
      }
    }
    return (
      <thead>
        <tr>
          {headers}
          <th />
        </tr>
      </thead>
    )
  }

  renderStudentRows() {
    const { submissions, current_slide, students, presence } = this.props;

    let sortedRows: Array<JSX.Element> | null

    const submittedStudents: Array<string> = Object.keys(submissions[current_slide]);
    const workingStudents: Array<string> | null = Object.keys(presence).filter((id) => submittedStudents.indexOf(id) === -1)

    if (this.state.showAllStudents) {
      // if there are no working students or if students are being sorted by lastname or flag,
      // they should all be sorted together
      if (this.state.sort === 'lastName' || this.state.sort === 'flag' || workingStudents.length < 1) {
        const sortedStudents: Array<string> | null = this.sortedRows(Object.keys(presence))
        sortedRows = sortedStudents.map((studentKey, index) => {
          return submittedStudents.indexOf(studentKey) !== -1
            ? this.renderSubmissionRow(studentKey, index)
            : this.renderNoSubmissionRow(studentKey)
        })
      // otherwise they need to be sorted separately and then concatenated
      } else {
        const sortedSubmittedStudents: Array<string> = this.sortedRows(Object.keys(submissions[current_slide]))
        const sortedSubmittedStudentRows = sortedSubmittedStudents.map((studentKey, index) => this.renderSubmissionRow(studentKey, index))
        const sortedWorkingStudents: Array<string> = workingStudents.sort((studentKey1, studentKey2) => sortByLastName(studentKey1, studentKey2, students))
        const sortedWorkingStudentRows = sortedWorkingStudents.map((studentKey) => this.renderNoSubmissionRow(studentKey))
        sortedRows = sortedSubmittedStudentRows.concat(sortedWorkingStudentRows)
      }
    } else {
      const sortedSubmittedStudents: Array<string> = this.sortedRows(Object.keys(submissions[current_slide]))
      sortedRows = sortedSubmittedStudents.map((studentKey, index) => this.renderSubmissionRow(studentKey, index))
    }
    return sortedRows
  }

  renderFlag = (studentKey: string) => {
    const { flaggedStudents, toggleStudentFlag, } = this.props
    let flag = grayFlag
    if (flaggedStudents && flaggedStudents[studentKey]) {
      flag = blueFlag
    }
    return <button className="interactive-wrapper focus-on-light" onClick={() => toggleStudentFlag(studentKey)} type="button"><img alt="" src={flag} /></button>
  }

  renderNoSubmissionRow(studentKey: string) {
    return (
      <tr key={studentKey}>
        <td>{this.props.students[studentKey]}</td>
        <td>{this.renderFlag(studentKey)}</td>
        <td className="no-student-response">Waiting for the student's answer...</td>
        <td />
        <td />
      </tr>
    )
  }

  renderHTMLFromSubmissionObject(submission) {
    return Object.keys(submission).map(key => `<span><strong>${key}: </strong>${submission[key]}</span>`).join(', ')
  }

  renderSubmissionRow(studentKey: string, index: number) {
    const { selected_submissions, submissions, current_slide, students, selected_submission_order, slideType, lessonPrompt, toggleSelected, timestamps, } = this.props;
    const { showDifferences, } = this.state

    return (
      <ReviewStudentRow
        calculateElapsedMilliseconds={calculateElapsedMilliseconds}
        currentSlide={current_slide}
        determineCheckbox={this.determineCheckbox}
        index={index}
        lessonPrompt={lessonPrompt}
        renderFlag={this.renderFlag}
        retryQuestionForStudent={this.retryQuestionForStudent}
        selectedSubmissionOrder={selected_submission_order}
        selectedSubmissions={selected_submissions}
        showDifferences={showDifferences}
        slideType={slideType}
        studentKey={studentKey}
        students={students}
        submissions={submissions}
        timestamps={timestamps}
        toggleSelected={toggleSelected}
      />
    )
  }

  renderNoSubmissionsTable(numStudents: number, index: number) {
    let content
    if (this.props.sampleCorrectAnswer) {
      content = this.renderSampleCorrectAnswer()
    } else {
      content = (<div className="no-student-submissions">
        Once students answer, anonymously discuss their work by selecting answers and then projecting them. You can use the step-by-step guide below to lead a discussion.
      </div>)
    }
    return (
      <li className="student-submission-item" key={index}>

        <div className="student-submission-item-header">
          <strong>0 of {numStudents}</strong> students have responded.
        </div>

        {content}

        <div className="student-submission-item-footer">
          {this.renderDisplayButton()}
        </div>

      </li>
    )
  }

  determineCheckbox = (checked: boolean) => {
    const { projecting, } = this.state
    if (checked) {
      return projecting ? <img alt="" src={checkedGreenCheckbox} /> : <img alt="" src={checkedGrayCheckbox} />
    } else {
      return projecting ? <img alt="" src={uncheckedGreenCheckbox} /> : <img alt="" src={uncheckedGrayCheckbox} />
    }
  }

  handleModelChange = (e) => {
    const { saveModel, } = this.props
    this.setState({ model: textEditorInputClean(e) });
    saveModel(textEditorInputClean(e));
  }

  handlePromptChange = (e) => {
    const { savePrompt, } = this.props
    this.setState({ prompt: textEditorInputClean(e) });
    savePrompt(textEditorInputClean(e));
  }

  resetSlide = () => {
    const { lessonPrompt, savePrompt, saveModel, } = this.props
    this.setState({ prompt: lessonPrompt ? textEditorInputClean(lessonPrompt) : '' });
    savePrompt(lessonPrompt ? textEditorInputClean(lessonPrompt) : '');
    this.setState({ model: ''})
    saveModel('');

  }

  renderCues() {
    const { cues, } = this.props

    if (!cues) { return }

    return (
      <Cues
        cues={cues}
        displayArrowAndText={false}
      />
    );
  }

  renderTeacherModel() {
    let promptEditor = <span />;
    if (this.props.lessonPrompt) {
      promptEditor = (
        <div className="prompt-component-wrapper">
          <MultipleTextEditor
            handleTextChange={this.handlePromptChange}
            lessonPrompt={textEditorInputClean(this.props.lessonPrompt)}
            text={this.state.prompt}
            title="Prompt:"
          />
        </div>
      )
    }
    return (
      <div className="model-wrapper">
        <div className="model-header-wrapper">
          <p className="model-header">
            Model Your Answer
          </p>
          <button className="reset-prompt-button interactive-wrapper focus-on-light" onClick={this.resetSlide} type="button">
            Reset Slide
          </button>
        </div>
        {promptEditor}
        {this.renderCues()}
        <div className="model-component-wrapper">
          <MultipleTextEditor
            handleTextChange={this.handleModelChange}
            text={this.state.model}
            title="Your Model:"
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <ul className="script-container">
        {this.renderScript(this.props.script)}
      </ul>
    )
  }
}

export default ScriptContainer
