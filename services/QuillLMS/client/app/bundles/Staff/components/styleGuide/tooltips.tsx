import * as React from 'react'
import { Tooltip, defaultTooltipTimeout} from './tooltip'
// import { Tooltip, defaultTooltipTimeout } from 'quill-component-library/dist/componentLibrary'

class Tooltips extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }

    document.addEventListener('click', this.closeTooltipIfOpen.bind(this));

    this.triggerTooltip = this.triggerTooltip.bind(this)
    this.startTimer = this.startTimer.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeTooltipIfOpen, false)
  }

  closeTooltipIfOpen() {
    if (this.state.visible) {
      this.setState({ visible: false, })
    }
  }

  triggerTooltip() {
    this.setState({ visible: true })
  }

  startTimer() {
    setTimeout(() => this.setState({ visible: false, }), defaultTooltipTimeout)
  }

  render() {
    return <div id="tooltips">
      <h2 className="style-guide-h2">Tooltips</h2>
      <div className="element-container">
        <pre>
{`constructor(props) {
  super(props)

  this.state = {
    visible: false
  }

  document.addEventListener('click', this.closeTooltipIfOpen.bind(this));

  this.triggerTooltip = this.triggerTooltip.bind(this)
}

triggerTooltip() {
  # Note that defaultTooltipTimeout here is imported from the Tooltip module
  this.setState({visible: true}, () => {
    setTimeout(() => this.setState({ visible: false, }), defaultTooltipTimeout)
  })
}

render() {
  return <div>
    <button className="quill-button medium primary contained quill-tooltip-trigger" onMouseOver={this.triggerTooltip}>
      Hover here
      <Tooltip text="I am a tooltip!" visible={this.state.visible} />
    </button>
  </div>
}

`}
        </pre>
        <span
          className="quill-tooltip-trigger"
          onMouseEnter={this.triggerTooltip}
          onMouseLeave={this.startTimer}
        >
          Hover here
          <Tooltip text="I am a tooltip!" visible={this.state.visible} />
        </span>
      </div>
    </div>
  }

}

export default Tooltips
