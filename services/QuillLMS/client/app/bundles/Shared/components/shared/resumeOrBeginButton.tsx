import * as React from 'react'

const ResumeOrBeginButton = ({ onClickFn, text, }) => (
  <button className="quill-button focus-on-light primary contained large" onClick={onClickFn} type="button">
    {text}
  </button>)

export { ResumeOrBeginButton }
