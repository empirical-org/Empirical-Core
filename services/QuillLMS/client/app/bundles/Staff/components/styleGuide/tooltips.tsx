import * as React from 'react'
import { Tooltip } from 'quill-component-library/dist/componentLibrary'

class Tooltips extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return <div id="tooltips">
      <h2 className="style-guide-h2">Tooltips</h2>
      <div className="element-container">
        <pre>
{`<div className="tooltips-container">
  <Tooltip
    tooltipText="I am a tooltip!"
    tooltipTriggerText="Hover here"
  />
  <Tooltip
    tooltipText="I am a different tooltip!"
    tooltipTriggerText="Or here"
  />
</div>`}
        </pre>
        <div className="tooltips-container">
          <Tooltip
            tooltipText="I am a tooltip!"
            tooltipTriggerText="Hover here"
          />
          <Tooltip
            tooltipText="I am a different tooltip!"
            tooltipTriggerText="Or here"
          />
        </div>
      </div>
    </div>
  }

}

export default Tooltips
