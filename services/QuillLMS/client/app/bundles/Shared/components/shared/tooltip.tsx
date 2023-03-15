import * as React from 'react'

import { onMobile } from '../..'

interface TooltipProps {
  isTabbable?: boolean,
  handleClick?: (e: any) => void,
  tooltipText: string,
  tooltipTriggerText: string|JSX.Element,
  tooltipTriggerTextClass?: string,
  tooltipTriggerTextStyle?: { [key:string]: any }
  tooltipTriggerStyle?: { [key:string]: any }
}

const VISIBLE = 'visible'
const RIGHT_JUSTIFY = 'right-justify'

class Tooltip extends React.Component<TooltipProps, { clickedFromMobile: boolean, tooltipVisible: boolean }> {
  private tooltip: any // eslint-disable-line react/sort-comp
  private tooltipTrigger: any // eslint-disable-line react/sort-comp
  private tooltipWrapper: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    document.addEventListener('click', this.handlePageClick.bind(this));

    this.state = { clickedFromMobile: false, tooltipVisible: false }

    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handlePageClick, false)
  }

  showTooltip() {
    const { tooltipText } = this.props
    const activeTooltips = document.getElementsByClassName('visible quill-tooltip')
    Array.from(activeTooltips).forEach(tooltip => tooltip.classList.remove('visible'))
    this.tooltip.innerHTML = tooltipText
    this.tooltip.classList.add(VISIBLE)
    if (this.tooltip.getBoundingClientRect().right >= window.innerWidth) {
      this.tooltipWrapper.classList.add(RIGHT_JUSTIFY)
    }
  }

  hideTooltip() {
    this.tooltip.classList.remove(VISIBLE)
    this.tooltipWrapper.classList.remove(RIGHT_JUSTIFY)
    this.tooltip.innerHTML = ''
    this.setState({ tooltipVisible: false });
  }

  handlePageClick = (e) => {
    const { tooltipTriggerTextClass, handleClick } = this.props
    const clickedOutsideTooltip = this.tooltip && e.target !== this.tooltip && e.target !== this.tooltipTrigger && e.target.className !== tooltipTriggerTextClass
    if (clickedOutsideTooltip) {
      handleClick && handleClick(e)
      this.hideTooltip()
    } else {
      this.handleTooltipClick(e)
    }
  }

  handleTooltipClick = (e) => {
    // https://stackoverflow.com/questions/57633984/react-stop-click-event-propagation-when-using-mixed-react-and-dom-events
    // we want to prevent any of this logic being fired by any upper level tooltip elements that are attached to the DOM
    if(e.nativeEvent) {
      const { tooltipVisible } = this.state

      if(!onMobile()) {
        return () => false;
      }
      if(tooltipVisible) {
        this.setState({ tooltipVisible: false })
        this.hideTooltip()
      } else {
        this.setState({ tooltipVisible: true })
        this.showTooltip()
        this.hideTooltip()
      }
    }
  }

  handleTooltipKeyDown = (e) => {
    if (e.key === 'Escape') { this.hideTooltip() }
  }

  render() {
    const { tooltipTriggerText, tooltipTriggerTextClass, tooltipTriggerStyle, tooltipTriggerTextStyle, isTabbable } = this.props
    const { tooltipVisible, } = this.state
    const tabIndex = isTabbable ? 0 : null;

    const triggerClass = `quill-tooltip-trigger ${tooltipVisible ? 'active' : ''}`

    return (
      <span
        aria-hidden={!isTabbable}
        className={triggerClass}
        ref={node => this.tooltipTrigger = node}
        role="tooltip"
        style={tooltipTriggerStyle}
      >
        <span
          className={`${tooltipTriggerTextClass}`}
          onBlur={this.hideTooltip}
          onClick={this.handleTooltipClick}
          onFocus={this.showTooltip}
          onKeyDown={this.handleTooltipKeyDown}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
          role="button"
          style={tooltipTriggerTextStyle}
          tabIndex={tabIndex}
        >
          {tooltipTriggerText}
        </span>
        <span className="quill-tooltip-wrapper" ref={node => this.tooltipWrapper = node}>
          <span
            aria-live="polite"
            className="quill-tooltip"
            ref={node => this.tooltip = node}
          />
        </span>
      </span>
    )
  }
}

Tooltip.defaultProps = {
  isTabbable: true
}

export { Tooltip, }
