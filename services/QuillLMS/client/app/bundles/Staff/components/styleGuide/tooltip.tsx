import React from 'react'

interface TooltipProps {
  tooltipText: string,
  tooltipTriggerText: string,
  tooltipTriggerClass?: string
}

export class Tooltip extends React.Component<TooltipProps, {}> {
  private timer: any
  private tooltip: any
  private tooltipTrigger: any

  constructor(props) {
    super(props)

    document.addEventListener('click', this.hideTooltipOnClick.bind(this));

    this.timer = null

    this.showTooltip = this.showTooltip.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideTooltipOnClick, false)
  }

  hideTooltipOnClick(e) {
    if (e.target !== this.tooltip && e.target !== this.tooltipTrigger) {
      this.tooltip.classList.remove('visible')
    }
  }

  showTooltip() {
    const activeTooltips = document.getElementsByClassName('visible quill-tooltip')
    Array.from(activeTooltips).forEach(tooltip => tooltip.classList.remove('visible'))
    clearTimeout(this.timer)
    this.tooltip.classList.add('visible')
  }

  hideTooltip() {
    this.tooltip.classList.remove('visible')
  }

  startTimer() {
    this.timer = setTimeout(this.hideTooltip, 1500)
  }

  render() {
    const { tooltipText, tooltipTriggerText, tooltipTriggerClass } = this.props
    return (
      <span
        className={`quill-tooltip-trigger ${tooltipTriggerClass}`}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.startTimer}
        ref={node => this.tooltipTrigger = node}
      >
        {tooltipTriggerText}
        <span
          className="quill-tooltip"
          ref={node => this.tooltip = node}
        >
          {tooltipText}
        </span>
      </span>)
  }
}
