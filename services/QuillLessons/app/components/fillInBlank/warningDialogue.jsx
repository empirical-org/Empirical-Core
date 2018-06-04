import React from 'react'
import tooltipChevron from '../../img/tooltipChevron.svg';

const warningDialogue = props => (
  <div className="warning-dialogue" style={props.style}>
    <span style={{ whiteSpace: 'nowrap', }}>{props.text}</span>
    <img style={props.chevyStyle} src={tooltipChevron} alt="chevron" />
  </div>
)

export default warningDialogue
