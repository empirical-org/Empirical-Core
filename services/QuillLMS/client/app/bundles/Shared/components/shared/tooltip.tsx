import * as React from 'react'

interface TooltipProps {
  isTabbable?: boolean,
  handleClick?: (e: any) => void,
  tooltipText: string,
  tooltipTriggerText: string|JSX.Element,
  tooltipTriggerTextClass?: string,
  tooltipTriggerTextStyle?: { [key:string]: any }
  tooltipTriggerStyle?: { [key:string]: any }
}

export class Tooltip extends React.Component<TooltipProps, { clickedFromMobile: boolean, tooltipVisible: boolean }> {
  private timer: any // eslint-disable-line react/sort-comp
  private tooltip: any // eslint-disable-line react/sort-comp
  private tooltipTrigger: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = { clickedFromMobile: false, tooltipVisible: false }

    this.timer = null

    this.showTooltip = this.showTooltip.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
  }

  showTooltip() {
    const { tooltipText } = this.props
    const activeTooltips = document.getElementsByClassName('visible quill-tooltip')
    Array.from(activeTooltips).forEach(tooltip => tooltip.classList.remove('visible'))
    clearTimeout(this.timer)
    this.tooltip.innerHTML = tooltipText
    this.tooltip.classList.add('visible')
    this.setState({ tooltipVisible: true })
  }

  hideTooltip() {
    this.tooltip.classList.remove('visible')
    this.tooltip.innerHTML = ''
    this.setState({ tooltipVisible: false })
  }

  startTimer() {
    this.timer = setTimeout(this.hideTooltip, 1500)
  }

  handleTooltipClick = (e) => {
    const { tooltipVisible } = this.state

    if(tooltipVisible) {
      this.setState({ tooltipVisible: false })
      this.hideTooltip()
    } else {
      this.setState({ tooltipVisible: true })
      this.showTooltip()
      this.startTimer()
    }
  }

  render() {
    const { tooltipTriggerText, tooltipTriggerTextClass, tooltipTriggerStyle, tooltipTriggerTextStyle, isTabbable } = this.props
    const tabIndex = isTabbable ? 0 : null;
    return (
      <span
        className="quill-tooltip-trigger"
        ref={node => this.tooltipTrigger = node}
        style={tooltipTriggerStyle}
      >
        <span
          className={`${tooltipTriggerTextClass}`}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.startTimer}
          onClick={this.handleTooltipClick}
          style={tooltipTriggerTextStyle}
          tabIndex={tabIndex}
        >
          {tooltipTriggerText}
        </span>
        <span className="quill-tooltip-wrapper">
          <span
            className="quill-tooltip"
            ref={node => this.tooltip = node}
          />
        </span>
      </span>
    )
  }
}
