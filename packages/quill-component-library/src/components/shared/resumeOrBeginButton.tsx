import React from 'react'

const ResumeOrBeginButton = ({ onClickFn, text, }) => (
  <button className="quill-button primary contained large" onClick={onClickFn} type="button">
    {text}
  </button>)

export { ResumeOrBeginButton }
