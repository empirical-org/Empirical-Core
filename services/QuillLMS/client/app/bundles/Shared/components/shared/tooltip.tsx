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

export class Tooltip extends React.Component<TooltipProps, { clickedFromMobile: boolean }> {
  private timer: any // eslint-disable-line react/sort-comp
  private tooltip: any // eslint-disable-line react/sort-comp
  private tooltipTrigger: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = { clickedFromMobile: false }

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
    const { clickedFromMobile } = this.state;
    const { handleClick } = this.props;
    const secondClickFromMobile = clickedFromMobile && e.pointerType === 'touch'
    const shouldHideTooltip = (this.tooltip && e.target !== this.tooltip && e.target !== this.tooltipTrigger && e.pointerType !== 'touch') || secondClickFromMobile
    if (shouldHideTooltip) {
      this.hideTooltip()
    }
    if(handleClick) {
      handleClick(e);
    }
    this.setState(prevState => ({clickedFromMobile: !prevState.clickedFromMobile}));
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
          onMouseEnter={isOnMobile ? () => false : this.showTooltip}
          onMouseLeave={isOnMobile ? () => false : this.startTimer}
          onTouchStart={isOnMobile ? this.showTooltip : () => false}
          onTouchEnd={isOnMobile ? this.startTimer : () => false}
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
