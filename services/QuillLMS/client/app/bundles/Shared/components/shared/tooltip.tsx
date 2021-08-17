import * as React from 'react'
import marked from 'marked';

interface TooltipProps {
  isMarkdown?: boolean,
  setNavigationUrl?: (url: string) => void,
  toggleWarningModal?: () => void,
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
    const { setNavigationUrl, toggleWarningModal } = this.props;
    if (this.tooltip && e.target !== this.tooltip && e.target !== this.tooltipTrigger) {
      this.hideTooltip()
    }
    if(e.target.href) {
      e.preventDefault();
      setNavigationUrl(e.target.href)
      toggleWarningModal();
    }
  }

  showTooltip() {
    const { tooltipText, isMarkdown } = this.props
    const activeTooltips = document.getElementsByClassName('visible quill-tooltip')
    Array.from(activeTooltips).forEach(tooltip => tooltip.classList.remove('visible'))
    clearTimeout(this.timer)
    this.tooltip.innerHTML = isMarkdown ? marked(tooltipText) : tooltipText
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
    const { tooltipTriggerText, tooltipTriggerTextClass, tooltipTriggerStyle, tooltipTriggerTextStyle, } = this.props
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
          style={tooltipTriggerTextStyle}
        >
          {tooltipTriggerText}
        </span>
        <span className="quill-tooltip-wrapper">
          <span
            className="quill-tooltip"
            ref={node => this.tooltip = node}
          />
        </span>
      </span>)
  }
}
