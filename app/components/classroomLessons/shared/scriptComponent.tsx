declare function require(name:string);
import * as React from 'react'
import { sortByLastName, sortByDisplayed, sortByTime, sortByFlag, sortByAnswer } from './studentSorts'
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  Question,
  Presence,
  Students,
  Submissions,
  Modes,
  ScriptItem
} from '../interfaces';
const uncheckedGrayCheckbox = require('../../../img/box_gray_unchecked.svg')
const checkedGrayCheckbox = require('../../../img/box_gray_checked.svg')
const uncheckedGreenCheckbox = require('../../../img/box_green_unchecked.svg')
const checkedGreenCheckbox = require('../../../img/box_green_checked.svg')

const moment = require('moment');

class ScriptContainer extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      projecting: this.props.modes ? this.props.modes[this.props.current_slide] : false,
      showAllStudents: false,
      sort: 'lastName',
      sortDirection: 'desc'
    }
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.toggleShowAllStudents = this.toggleShowAllStudents.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.clearSelectedSubmissions = this.clearSelectedSubmissions.bind(this)
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this)
    this.retryQuestion = this.retryQuestion.bind(this)
  }

  renderScript(script: Array<ScriptItem>) {
    return script.map((item, index) => {
      switch(item.type) {
        case 'T-REVIEW':
          return this.renderReview(index);
        case 'STEP-HTML':
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
      const { selected_submissions, current_slide }: { selected_submissions: SelectedSubmissions, current_slide: string } = this.props;
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
    const { submissions, current_slide }: { submissions: Submissions, current_slide: string } = this.props;
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
    const {submissions, selected_submissions, current_slide, students} = this.props
    const sortedRows = studentsToBeSorted.sort((name1, name2) => {
      switch(this.state.sort) {
        case 'flag':
        case 'answers':
          const answer1 = submissions[current_slide][name1].data
          const answer2 = submissions[current_slide][name2].data
          return sortByAnswer(answer1, answer2)
        case 'time':
          const time1 = this.elapsedMilliseconds(moment(submissions[current_slide][name1].timestamp))
          const time2 = this.elapsedMilliseconds(moment(submissions[current_slide][name2].timestamp))
          return sortByTime(time1, time2)
        case 'displayed':
          if (selected_submissions && selected_submissions[current_slide]) {
            return sortByDisplayed(selected_submissions[current_slide][name1], selected_submissions[current_slide][name2])
          } else {
            return sortByLastName(name1, name2, students)
          }
        case 'lastName':
        default:
        return sortByLastName(name1, name2, students)
      }
    })

    return this.state.sortDirection === 'desc' ? sortedRows : sortedRows.reverse()
  }

  renderReview(index: number) {
    const { selected_submissions, submissions, current_slide, students, presence } = this.props;
    const numStudents: number = Object.keys(presence).length;
    if (submissions) {
      const numAnswers: number = Object.keys(submissions[current_slide]).length;
      let remainingStudents: Array<JSX.Element> | null = null;

      if (this.state.showAllStudents) {
        const submittedStudents: Array<string> | null = Object.keys(submissions[current_slide]);
        const workingStudents: Array<string> | null = Object.keys(presence).filter((id) => {
          return submittedStudents.indexOf(id) === -1;
        })
        const sortedWorkingStudents: Array<string> | null = workingStudents.sort((name1, name2) => {
          return sortByLastName(name1, name2, students);
        })
        if (sortedWorkingStudents) {
          remainingStudents = sortedWorkingStudents.map((name) => this.renderNoSubmissionRow(name))
        }
      }

      const sortedNames: Array<string> = this.sortedRows(Object.keys(submissions[current_slide]))

      const submissionComponents = sortedNames.map((name, index) => this.renderSubmissionRow(name, index));

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
                {submissionComponents}
                {remainingStudents}
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
    const headers = []
    for (let key in fields) {
      let caret = sort === key && dir === 'asc' ? 'fa-caret-up' : 'fa-caret-down'
      const header = key === 'display'
      ? <th onClick={() => this.setSort(key)} key={key}>{fields[key]}<i className={`fa ${caret}`}/> {this.renderUnselectAllButton()}</th>
      : <th onClick={() => this.setSort(key)} key={key}>{fields[key]}<i className={`fa ${caret}`}/></th>
      headers.push(header)
    })
    return <thead>
      <tr>
        {headers}
      </tr>
    </thead>

  }

  renderNoSubmissionRow(name: string) {
    return <tr key={name}>
      <td>{this.props.students[name]}</td>
      <td></td>
      <td className="no-student-response">Waiting for the student's answer...</td>
      <td></td>
      <td></td>
    </tr>
  }

  renderSubmissionRow(name: string, index: number) {
    const { selected_submissions, submissions, current_slide, students } = this.props;
    const text: any = submissions[current_slide][name].data
    const submittedTimestamp: string = submissions[current_slide][name].timestamp
    const elapsedTime: any = this.formatElapsedTime(moment(submittedTimestamp))
    const checked: boolean = selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][name] : false
    const checkbox = this.determineCheckbox(checked)
    const studentName: string = students[name]
      return <tr key={index}>
        <td>{studentName}</td>
        <td></td>
        <td>{text}</td>
        <td>{elapsedTime}</td>
        <td>
          <input
            id={studentName}
            name={studentName}
            type="checkbox"
            checked={checked}
          />
          <label htmlFor={studentName} onClick={(e) => { this.props.toggleSelected(e, current_slide, name); }}>
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
    const formattedMinutes: string = elapsedMinutes > 9 ? elapsedMinutes : 0 + elapsedMinutes.toString()
    const formattedSeconds: string = elapsedSeconds > 9 ? elapsedSeconds : 0 + elapsedSeconds.toString()
    return formattedMinutes + ':' + formattedSeconds
  }

  determineCheckbox(checked: boolean) {
    if (checked) {
      return this.state.projecting ? <img src={checkedGreenCheckbox} /> : <img src={checkedGrayCheckbox} />
    } else {
      return this.state.projecting ? <img src={uncheckedGreenCheckbox} /> : <img src={uncheckedGrayCheckbox} />
    }
  }

  renderStepHTML(item: ScriptItem, onlyShowHeaders: boolean | null, index: number) {
    const html = onlyShowHeaders
      ? <li className="script-item" key={index}><p className="script-item-heading">{item.data.heading}</p></li>
      : (<li className="script-item" key={index}>
        <p className="script-item-heading">{item.data.heading}</p>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: item.data.body, }} />
      </li>)

    return html
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
