declare function require(name:string);
import * as React from 'react'
import { sortByLastName, sortByDisplayed, sortByTime, sortByFlag, sortByAnswer } from './studentSorts'
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
} from 'interfaces/classroomLessons'
const uncheckedGrayCheckbox = require('../../../img/box_gray_unchecked.svg')
const checkedGrayCheckbox = require('../../../img/box_gray_checked.svg')
const uncheckedGreenCheckbox = require('../../../img/box_green_unchecked.svg')
const checkedGreenCheckbox = require('../../../img/box_green_checked.svg')
const grayFlag = require('../../../img/flag_gray.svg')
const blueFlag = require('../../../img/flag_blue.svg')
const moment = require('moment');

interface ScriptContainerProps {
  script: Array<ScriptItem>,
  onlyShowHeaders: boolean,
  [key: string]: any,
}

interface ScriptContainerState {
  projecting: boolean,
  showAllStudents: boolean,
  sort: string,
  sortDirection: string
}

class ScriptContainer extends React.Component<ScriptContainerProps, ScriptContainerState> {

  constructor(props) {
    super(props);
    this.state = {
      projecting: this.props.modes && (this.props.modes[this.props.current_slide] === "PROJECT") ? true : false,
      showAllStudents: false,
      sort: 'time',
      sortDirection: 'desc'
    }
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.toggleShowAllStudents = this.toggleShowAllStudents.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.clearSelectedSubmissions = this.clearSelectedSubmissions.bind(this)
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this)
    this.retryQuestion = this.retryQuestion.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState( {
      projecting: nextProps.modes && (nextProps.modes[nextProps.current_slide] === "PROJECT") ? true : false
    })
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
          return this.renderStepHTML(item, this.props.onlyShowHeaders, index);
        case 'STEP-HTML-TIP':
          return this.renderStepHTML(item, this.props.onlyShowHeaders, index);
        default:
          return <li key={index}>Unsupported type</li>
      }
    });
  }

  startDisplayingAnswers() {
    this.setState({projecting: true})
    this.props.startDisplayingAnswers();
  }

  toggleShowAllStudents() {
    this.setState({showAllStudents: !this.state.showAllStudents})
  }

  stopDisplayingAnswers() {
    this.setState({projecting: false})
    this.props.stopDisplayingAnswers();
  }

  renderRetryQuestionButton() {
    return <p onClick={this.retryQuestion}><i className="fa fa-refresh"/>Retry Question</p>
  }

  retryQuestion() {
    this.stopDisplayingAnswers()
    this.clearSelectedSubmissions()
    this.clearAllSubmissions()
  }

  renderDisplayButton() {
    if (this.state.projecting) {
      return (
        <button className={"show-prompt-button "} onClick={this.stopDisplayingAnswers}>Show Prompt</button>
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

  renderUnselectAllButton() {
    const { selected_submissions, current_slide } = this.props;
    if (selected_submissions && selected_submissions[current_slide]) {
      return <p onClick={this.clearSelectedSubmissions}>Unselect All</p>
    } else {
      return <p></p>
    }
  }

  clearSelectedSubmissions() {
    this.props.clearAllSelectedSubmissions(this.props.current_slide)
  }

  clearAllSubmissions() {
    this.props.clearAllSubmissions(this.props.current_slide)
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
    const {submissions, selected_submissions, current_slide, students, flaggedStudents} = this.props
    const sortedRows = studentsToBeSorted.sort((studentKey1, studentKey2) => {
      switch(this.state.sort) {
        case 'flag':
        if (flaggedStudents) {
          const studentFlag1 = flaggedStudents[studentKey1] ? flaggedStudents[studentKey1] : false
          const studentFlag2 = flaggedStudents[studentKey2] ? flaggedStudents[studentKey2] : false
          return sortByFlag(studentFlag1, studentFlag2)
        }
        case 'answers':
          const answer1 = submissions[current_slide][studentKey1].data
          const answer2 = submissions[current_slide][studentKey2].data
          return sortByAnswer(answer1, answer2)
        case 'time':
          const time1 = this.elapsedMilliseconds(moment(submissions[current_slide][studentKey1].timestamp))
          const time2 = this.elapsedMilliseconds(moment(submissions[current_slide][studentKey2].timestamp))
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

  renderReview(index: number) {
    const { selected_submissions, submissions, current_slide, students, presence } = this.props;
    const numStudents: number = presence ? Object.keys(presence).length : 0;
    if (submissions && submissions[current_slide]) {
      const numAnswers: number = Object.keys(submissions[current_slide]).length;

      return (
        <li className="student-submission-item" key={index}>
          <div className="student-submission-item-header">
            <strong>{numAnswers} of {numStudents}</strong> Students have answered.
            {this.renderShowRemainingStudentsButton()}
          </div>
          <div className="student-submission-item-table">
            <table >
              {this.renderTableHeaders()}
              <tbody>
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

  renderTableHeaders() {
    const sort = this.state.sort
    const dir = this.state.sortDirection
    const fields = {
      'lastName': 'Students',
      'flag': 'Flag',
      'answers': 'Answers',
      'time': 'Time',
      'displayed': 'Select to Display'
    }
    const headers: Array<JSX.Element> = []
    for (let key in fields) {
      let caret = sort === key && dir === 'asc' ? 'fa-caret-up' : 'fa-caret-down'
      const header = key === 'displayed'
      ? <th key={key}>{fields[key]}<i className={`fa ${caret}`} onClick={() => this.setSort(key)}/> {this.renderUnselectAllButton()}</th>
      : <th key={key}>{fields[key]}<i className={`fa ${caret}`} onClick={() => this.setSort(key)}/></th>
      headers.push(header)
    }
    return <thead>
      <tr>
        {headers}
      </tr>
    </thead>
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

  renderFlag(studentKey: string) {
    let flag = grayFlag
    if (this.props.flaggedStudents && this.props.flaggedStudents[studentKey]) {
      flag = blueFlag
    }
    return <img onClick={() => this.props.toggleStudentFlag(studentKey)} src={flag} />
  }

  renderNoSubmissionRow(studentKey: string) {
    return <tr key={studentKey}>
      <td>{this.props.students[studentKey]}</td>
      <td>{this.renderFlag(studentKey)}</td>
      <td className="no-student-response">Waiting for the student's answer...</td>
      <td></td>
      <td></td>
    </tr>
  }

  renderSubmissionRow(studentKey: string, index: number) {
    const { selected_submissions, submissions, current_slide, students } = this.props;
    const text: any = submissions[current_slide][studentKey].data
    const html: any = <span dangerouslySetInnerHTML={{__html: text}}/>
    const submittedTimestamp: string = submissions[current_slide][studentKey].timestamp
    const elapsedTime: any = this.formatElapsedTime(moment(submittedTimestamp))
    const checked: boolean = selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][studentKey] : false
    const checkbox = this.determineCheckbox(checked)
    const studentName: string = students[studentKey]
      return <tr key={index}>
        <td>{studentName}</td>
        <td>{this.renderFlag(studentKey)}</td>
        <td>{html}</td>
        <td>{elapsedTime}</td>
        <td>
          <input
            id={studentName}
            name={studentName}
            type="checkbox"
            defaultChecked={checked}
          />
          <label htmlFor={studentName} onClick={(e) => { this.props.toggleSelected(e, current_slide, studentKey); }}>
            {checkbox}
          </label>
        </td>
      </tr>

  }

  renderNoSubmissionsTable(numStudents: number, index: number) {
    return <li className="student-submission-item" key={index}>

        <div className="student-submission-item-header">
          <strong>0 of {numStudents}</strong> Students have answered.
        </div>

        <div className="no-student-submissions">
          Once students answer, anonymously discuss their work by selecting answers and then projecting them. You can use the step-by-step guide below to lead a discussion.
        </div>

        <div className="student-submission-item-footer">
          {this.renderDisplayButton()}
        </div>

      </li>
  }

  elapsedMilliseconds(submittedTimestamp: any) {
    return submittedTimestamp.diff(moment(this.props.timestamps[this.props.current_slide]))
  }

  formatElapsedTime(submittedTimestamp: any) {
    const elapsedMilliseconds : number  = this.elapsedMilliseconds(submittedTimestamp)
    const elapsedMinutes: number = moment.duration(elapsedMilliseconds).minutes()
    const elapsedSeconds: number = moment.duration(elapsedMilliseconds).seconds()
    const formattedMinutes: string|number = elapsedMinutes > 9 ? elapsedMinutes : 0 + elapsedMinutes.toString()
    const formattedSeconds: string|number = elapsedSeconds > 9 ? elapsedSeconds : 0 + elapsedSeconds.toString()
    return formattedMinutes + ':' + formattedSeconds
  }

  determineCheckbox(checked: boolean) {
    console.log(checked)
    if (checked) {
      return this.state.projecting ? <img src={checkedGreenCheckbox} /> : <img src={checkedGrayCheckbox} />
    } else {
      return this.state.projecting ? <img src={uncheckedGreenCheckbox} /> : <img src={uncheckedGrayCheckbox} />
    }
  }

  renderStepHTML(item: ScriptItem, onlyShowHeaders: boolean | null, index: number) {
    if (item.data) {
      const html = onlyShowHeaders
        ? <li className="script-item" key={index}><p className="script-item-heading">{item.data.heading}</p></li>
        : (<li className="script-item" key={index}>
          <p className="script-item-heading">{item.data.heading}</p>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: item.data.body, }} />
        </li>)
      return html
    }
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
