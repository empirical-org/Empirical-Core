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

export class Tooltip extends React.Component<TooltipProps, {}> {
  private timer: any // eslint-disable-line react/sort-comp
  private tooltip: any // eslint-disable-line react/sort-comp
  private tooltipTrigger: any // eslint-disable-line react/sort-comp

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
    const { handleClick } = this.props;
    if (this.tooltip && e.target !== this.tooltip && e.target !== this.tooltipTrigger) {
      this.hideTooltip()
    }
    if(handleClick) {
      handleClick(e);
    }
  }

  showTooltip() {
    const { tooltipText } = this.props
    const activeTooltips = document.getElementsByClassName('visible quill-tooltip')
    Array.from(activeTooltips).forEach(tooltip => tooltip.classList.remove('visible'))
    clearTimeout(this.timer)
    this.tooltip.innerHTML = tooltipText
    this.tooltip.classList.add('visible')
  }

  hideTooltip() {
    this.tooltip.classList.remove('visible')
    this.tooltip.innerHTML = ''
  }

  startTimer() {
    this.timer = setTimeout(this.hideTooltip, 1500)
  }

  render() {
    const { tooltipTriggerText, tooltipTriggerTextClass, tooltipTriggerStyle, tooltipTriggerTextStyle, isTabbable } = this.props
    const tabIndex = isTabbable ? 0 : null;
    const isOnMobile = window.innerWidth < 770;
    return (
      <span
        className="quill-tooltip-trigger"
        ref={node => this.tooltipTrigger = node}
        style={tooltipTriggerStyle}
      >
        <span
          className={`${tooltipTriggerTextClass}`}
          onMouseEnter={isOnMobile ? null : this.showTooltip}
          onMouseLeave={isOnMobile ? null : this.startTimer}
          onTouchStart={isOnMobile ? this.showTooltip: null}
          onTouchEnd={isOnMobile ? this.startTimer: null}
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
