import * as React from 'react'

interface SegmentedControlProps {
  activeTab: string,
  size: string,
  buttons: {
    activeIconSrc?: string,
    disabled?: boolean,
    inactiveIconSrc?: string,
    label: string,
    onClick: (e: React.SyntheticEvent) => void
  }[]
}

export const SegmentedControl = ({ activeTab, size, buttons }: SegmentedControlProps) => {
  return(
    <div className="segmented-control-container">
      {buttons.map((button, i) => {
        const { activeIconSrc, disabled, inactiveIconSrc, label, onClick } = button
        let style = size
        if(i === 0) {
          style += ' left'
        } else if(i === buttons.length - 1) {
          style += ' right'
        }
        if(disabled) {
          style += ' disabled'
        }
        return (
          <button className={`interactive-wrapper segmented-control-button ${style} ${label === activeTab ? 'active' : ''}`} disabled={disabled} key={`${label}-${i}`} onClick={onClick} value={label}>
            {activeIconSrc && inactiveIconSrc && <img alt="" src={label === activeTab ? activeIconSrc : inactiveIconSrc} />}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
