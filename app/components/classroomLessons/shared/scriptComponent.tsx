import * as React from 'react'
import {
  ScriptItem
} from '../interfaces'

class ScriptContainer extends React.Component<{script: Array<ScriptItem>; onlyShowHeaders: boolean | null}> {

  constructor(props) {
    super(props);
    this.state = {
      projecting: false,
      showAllStudents: false,
    }
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.toggleShowAllStudents = this.toggleShowAllStudents.bind(this);
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

  renderDisplayButton() {
    if (this.state.projecting) {
      return (
        <button className={"show-prompt-button "}>Show Prompt</button>
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

  renderShowRemainingStudents() {
    const { submissions, current_slide } = this.props;
    const numAnswers = Object.keys(submissions[current_slide]).length;
    if (numAnswers > 0) {
      return (
        <span className="show-remaining-students-button" onClick={this.toggleShowAllStudents}> Show Remaining Students</span>
      )
    }
  }

  renderReview() {
    const { selected_submissions, submissions, current_slide, students, presence } = this.props;
    const numAnswers = Object.keys(submissions[current_slide]).length;
    const numStudents = Object.keys(presence).length;
    if (submissions) {
      let remainingStudents;
      if (this.state.showAllStudents) {
        const submittedStudents = Object.keys(submissions[current_slide]);
        const workingStudents = Object.keys(presence).filter((id) => {
          return !submittedStudents.includes(id);
        })
        remainingStudents = workingStudents.map((key) => (
          <tr>
            <td>{students[key]}</td>
            <td></td>
            <td className="no-student-response">Waiting for the student's answer...</td>
            <td></td>
            <td></td>
          </tr>
        ))
      }
      const submissionComponents = Object.keys(submissions[current_slide]).map(key => (
        <tr >
          <td>{students[key]}</td>
          <td></td>
          <td>{submissions[current_slide][key]}</td>
          <td></td>
          <td><input type="checkbox" name="students[key]" checked={selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][key] : false} onClick={(e) => { this.props.toggleSelected(e, current_slide, key); }} /></td>
        </tr>
        ));
      return (
        <li className="student-submission-item">
          <div className="student-submission-item-header">
            <strong>{numAnswers} of {numStudents}</strong> Students have answered.
            {this.renderShowRemainingStudents()}
          </div>
          <div className="student-submission-item-table">
            <table >
              <thead>
                <tr>
                  <th>Students</th>
                  <th>Flag</th>
                  <th>Answers</th>
                  <th>Time</th>
                  <th>Display?</th>
                </tr>
              </thead>
              <tbody>
                {submissionComponents}
                {remainingStudents}
              </tbody>
            </table>
          </div>

          <div className="student-submission-item-footer">
            <button onClick={this.props.stopDisplayingAnswers}>Stop displaying student answers</button>
            {this.renderDisplayButton()}

          </div>

        </li>
      );
    }
  }

  renderStepHTML(item: ScriptItem, onlyShowHeaders: boolean) {
    const html = onlyShowHeaders
      ? <li className="script-item"><p>{item.data.heading}</p></li>
      : (<li className="script-item">
        <p>{item.data.heading}</p>
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
