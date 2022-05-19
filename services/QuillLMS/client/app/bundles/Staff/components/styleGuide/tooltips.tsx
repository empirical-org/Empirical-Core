import * as React from 'react'

import { Tooltip } from '../../../Shared/index'

class Tooltips extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="tooltips">
        <h2 className="style-guide-h2">Tooltips</h2>
        <div className="element-container">
          <pre>
            {
              `<div className="tooltips-container">
  <Tooltip
    tooltipText="I am a tooltip!"
    tooltipTriggerText="Hover here"
  />
  <Tooltip
    isTabbable={true}
    tooltipText="But the wind and water know all the earth’s secrets. They’ve seen and heard all that has ever been said or done. And if you listen, they will tell you all the stories and sing every song. The stories of everyone who has ever lived. Millions and millions of lives. Millions and millions of stories."
    tooltipTriggerText="Or here"
  />
</div>`
            }
          </pre>
          <div className="tooltips-container">
            <Tooltip
              tooltipText="I am a tooltip!"
              tooltipTriggerText="Hover here"
            />
            <Tooltip
              isTabbable={true}
              tooltipText="But the wind and water know all the earth’s secrets. They’ve seen and heard all that has ever been said or done. And if you listen, they will tell you all the stories and sing every song. The stories of everyone who has ever lived. Millions and millions of lives. Millions and millions of stories."
              tooltipTriggerText="Or here (I'm tabbable)"
            />
          </div>
        </div>
      </div>
    )
  }

}

export default Tooltips
