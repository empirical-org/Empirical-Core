import React from 'react'

interface WarningDialogueProps {
  style: object;
  text: string;
  chevyStyle: object;
}

const WarningDialogue = (props: WarningDialogueProps) => (
  <div className="warning-dialogue" style={props.style}>
    <span style={{ whiteSpace: 'nowrap', }}>{props.text}</span>
    <img style={props.chevyStyle} src='http://localhost:45537/images/icons/tooltipChevron.svg' alt="chevron" />
  </div>
)

export {WarningDialogue}
