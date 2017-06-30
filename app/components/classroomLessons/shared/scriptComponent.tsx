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
        <li
          style={{
            marginTop: 10,
            borderBottom: '1px solid magenta',
          }}
        >
          <input type="checkbox" name="students[key]" checked={selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][key] : false} onClick={(e) => { this.toggleSelected(e, current_slide, key); }} />
          {submissions[current_slide][key]} - {students[key]}

        </li>
        ));
      return (
        <div>
          <ul
            style={{
              margin: 10,
              padding: 10,
              border: '1px solid magenta',
            }}
          >
            {submissionComponents}
          </ul>
          <button onClick={this.props.startDisplayingAnswers}>Display Selected Answers</button>
          <button onClick={this.props.stopDisplayingAnswers}>Stop displaying student answers</button>
        </div>
      );
    }
  }

  renderStepHTML(item: ScriptItem, onlyShowHeaders: boolean) {
    const html = onlyShowHeaders
      ? <li className="script-item"><p>{item.data.heading}</p></li>
      : (<li className="script-item">
        <p className="script-item-heading">{item.data.heading}</p>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: item.data.body, }} />
      </li>)

    return html
  }

  render() {
    return (
      <ul>
      {this.renderScript(this.props.script)}
      </ul>
    )

  }
}

export default ScriptContainer
