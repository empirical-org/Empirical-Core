import React from 'react'

const ResumeOrBeginButton = ({ onClickFn, text, }) => (
  <button className="quill-button focus-on-light primary contained large" onClick={onClickFn} tabIndex="0" type="button">
    {text}
  </button>)

export { ResumeOrBeginButton }
