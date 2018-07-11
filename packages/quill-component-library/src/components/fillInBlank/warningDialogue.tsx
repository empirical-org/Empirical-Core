import React from 'react'

// interface WarningDialogueProps {
//   style: object;
//   text: string;
//   chevyStyle: object;
// }

const WarningDialogue = (props: any) => (
  <div className="warning-dialogue" style={props.style}>
    <span style={{ whiteSpace: 'nowrap', }}>{props.text}</span>
    <img style={props.chevyStyle} src='https://assets.quill.org/images/icons/tooltipChevron.svg' alt="chevron" />
  </div>
)

export {WarningDialogue}
