import * as React from 'react'

export const SegmentedControl = ({ activeTab, size, buttons }) => {
  return(
    <div className="segmented-control-container">
      {buttons.map((button, i) => {
        const { activeIconSrc, inactiveIconSrc, label, onClick } = button
        let style = size
        if(i === 0) {
          style += ' left'
        } else if(i === buttons.length - 1) {
          style += ' right'
        }
        return (
          <button className={`interactive-wrapper segmented-control-button ${style} ${label === activeTab ? 'active' : ''}`} key={`${label}-${i}`} onClick={onClick} value={label}>
            {activeIconSrc && inactiveIconSrc && <img alt="" src={label === activeTab ? activeIconSrc : inactiveIconSrc} />}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
