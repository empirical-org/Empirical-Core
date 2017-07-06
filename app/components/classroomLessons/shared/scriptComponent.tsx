declare function require(name:string);
import * as React from 'react'
import { sortByLastName } from './sortByLastName'
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
        const sortedWorkingStudents: Array<string> | null = workingStudents.sort((key1, key2) => {
          return sortByLastName(key1, key2, students);
        })
        if (sortedWorkingStudents) {
          remainingStudents = sortedWorkingStudents.map((key) => (
            <tr>
              <td>{students[key]}</td>
              <td></td>
              <td className="no-student-response">Waiting for the student's answer...</td>
              <td></td>
              <td></td>
            </tr>
          ))
        }

      }
      const sortedNames: Array<string> = Object.keys(submissions[current_slide]).sort((key1, key2) => {
        return sortByLastName(key1, key2, students);
      })
      const submissionComponents = sortedNames.map((key, index) => {
        // the following line will not be necessary
        // when all submissions are stored as objects with a data prop
        const text: any = submissions[current_slide][key].data
        const submittedTimestamp: string = submissions[current_slide][key].timestamp
        const elapsedTime: any = this.formatElapsedTime(moment(submittedTimestamp))
        const checked: boolean = selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][key] : false
        const checkbox = this.determineCheckbox(checked)
        const studentName: string = students[key]
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
              <label htmlFor={studentName} onClick={(e) => { this.props.toggleSelected(e, current_slide, key); }}>
                {checkbox}
              </label>
            </td>
          </tr>
        }
        );
      return (
        <li className="student-submission-item" key={index}>
          <div className="student-submission-item-header">
            <strong>{numAnswers} of {numStudents}</strong> Students have answered.
            {this.renderShowRemainingStudentsButton()}
          </div>
          <div className="student-submission-item-table">
            <table >
              <thead>
                <tr>
                  <th>Students<i className="fa fa-caret-down"/></th>
                  <th>Flag<i className="fa fa-caret-down"/></th>
                  <th>Answers<i className="fa fa-caret-down"/></th>
                  <th>Time<i className="fa fa-caret-down"/></th>
                  <th>Select to Display<i className="fa fa-caret-down"/> {this.renderUnselectAllButton()}</th>
                </tr>
              </thead>
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
      return (
        <li className="student-submission-item" key={index}>
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
      )
    }
  }

  formatElapsedTime(submittedTimestamp: any) {
    const elapsedMilliseconds: number = submittedTimestamp.diff(moment(this.props.loadedTimestamp))
    const elapsedMinutes: number = moment.duration(elapsedMilliseconds).minutes()
    const elapsedSeconds: number = moment.duration(elapsedMilliseconds).seconds()
    const formattedMinutes: string | number = elapsedMinutes > 9 ? elapsedMinutes : 0 + elapsedMinutes.toString()
    const formattedSeconds: string | number = elapsedSeconds > 9 ? elapsedSeconds : 0 + elapsedSeconds.toString()
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
