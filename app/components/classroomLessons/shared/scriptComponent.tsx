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
    return (
      <li>Hi</li>
    )
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
      <ul>
      {this.renderScript(this.props.script)}
      </ul>
    )

  }
}

export default ScriptContainer
