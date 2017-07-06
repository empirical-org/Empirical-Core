import * as React from 'react'
import {
  ScriptItem
} from '../interfaces'
import { sortByLastName } from './sortByLastName'
import uncheckedGrayCheckbox from '../../../img/box_gray_unchecked.svg'
import checkedGrayCheckbox from '../../../img/box_gray_checked.svg'
import uncheckedGreenCheckbox from '../../../img/box_green_unchecked.svg'
import checkedGreenCheckbox from '../../../img/box_green_checked.svg'


const moment = require('moment');

class ScriptContainer extends React.Component<{script: Array<ScriptItem>; onlyShowHeaders: boolean | null}> {

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
  }

  renderScript(script: Array<ScriptItem>) {
    return script.map((item) => {
      switch(item.type) {
        case 'T-REVIEW':
          return this.renderReview(item);
        case 'STEP-HTML':
          return this.renderStepHTML(item, this.props.onlyShowHeaders);
        default:
          return <li>Unsupported type</li>
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

  renderDisplayButton() {
    if (this.state.projecting) {
      return (
        <button className={"show-prompt-button "} onClick={this.stopDisplayingAnswers}>Show Prompt</button>
      )
    } else {
      const { selected_submissions, current_slide } = this.props;
      let buttonInactive = true;
      let buttonClass = "inactive";
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
    const { submissions, current_slide } = this.props;
    const numAnswers = Object.keys(submissions[current_slide]).length;
    const verb = this.state.showAllStudents ? "Hide" : "Show";
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

  renderReview() {
    const { selected_submissions, submissions, current_slide, students, presence } = this.props;
    if (submissions) {
      const numAnswers = Object.keys(submissions[current_slide]).length;
      const numStudents = Object.keys(presence).length;
      let remainingStudents;
      if (this.state.showAllStudents) {
        const submittedStudents = Object.keys(submissions[current_slide]);
        const workingStudents = Object.keys(presence).filter((id) => {
          return !submittedStudents.includes(id);
        })
        const sortedWorkingStudents = workingStudents.sort((key1, key2) => {
          return sortByLastName(key1, key2, students);
        }
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
      }
      const submissionComponents = sortedNames.map((key, index) => {
        // the following line will not be necessary
        // when all submissions are stored as objects with a data prop
        const text = submissions[current_slide][key].data
        const submittedTimestamp = submissions[current_slide][key].timestamp
        const elapsedTime = this.formatElapsedTime(moment(submittedTimestamp))
        const checked = selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][key] : false
        const checkbox = this.determineCheckbox(checked)
        const studentName = students[key]
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
              <label for={studentName} onClick={(e) => { this.props.toggleSelected(e, current_slide, key); }}>
                {checkbox}
              </label>
            </td>
          </tr>
        }
        );
      return (
        <li className="student-submission-item">
          <div className="student-submission-item-header">
            <strong>{numAnswers} of {numStudents}</strong> Students have answered.
            {this.renderShowRemainingStudentsButton()}
          </div>
          <div className="student-submission-item-table">
            <table >
              <thead>
                <tr>
                  <th>Students</th>
                  <th>Flag</th>
                  <th>Answers</th>
                  <th>Time</th>
                  <th>Select to Display {this.renderUnselectAllButton()}</th>
                </tr>
              </thead>
              <tbody>
                {submissionComponents}
                {remainingStudents}
              </tbody>
            </table>
          </div>

          <div className="student-submission-item-footer">
            {this.renderDisplayButton()}

          </div>

        </li>
      );
    } else {
      const numStudents = Object.keys(presence).length;
      return (
        <li className="student-submission-item">
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

  formatElapsedTime(submittedTimestamp: string) {
    const elapsedMilliseconds = submittedTimestamp.diff(moment(this.props.loadedTimestamp))
    const elapsedMinutes = moment.duration(elapsedMilliseconds).minutes()
    const elapsedSeconds = moment.duration(elapsedMilliseconds).seconds()
    const formattedMinutes = elapsedMinutes > 9 ? elapsedMinutes : 0 + elapsedMinutes.toString()
    const formattedSeconds = elapsedSeconds > 9 ? elapsedSeconds : 0 + elapsedSeconds.toString()
    return formattedMinutes + ':' + formattedSeconds
  }

  determineCheckbox(checked) {
    if (checked) {
      return this.state.projecting ? <img src={checkedGreenCheckbox} /> : <img src={checkedGrayCheckbox} />
    } else {
      return this.state.projecting ? <img src={uncheckedGreenCheckbox} /> : <img src={uncheckedGrayCheckbox} />
    }
  }

  renderStepHTML(item: ScriptItem, onlyShowHeaders: boolean) {
    const html = onlyShowHeaders
      ? <li className="script-item"><p className="script-item-heading">{item.data.heading}</p></li>
      : (<li className="script-item">
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
