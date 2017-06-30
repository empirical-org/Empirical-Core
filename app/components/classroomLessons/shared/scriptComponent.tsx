import * as React from 'react'
import {
  ScriptItem
} from '../interfaces'

class ScriptContainer extends React.Component<{script: Array<ScriptItem>; onlyShowHeaders: boolean | null}> {

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

  renderReview() {
    const { selected_submissions, submissions, current_slide, students, } = this.props;
    if (submissions) {
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
            How many students did what?
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
              </tbody>
            </table>
          </div>

          <div className="student-submission-item-footer">
            <button onClick={this.props.startDisplayingAnswers}>Display Selected Answers</button>
            <button onClick={this.props.stopDisplayingAnswers}>Stop displaying student answers</button>
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
