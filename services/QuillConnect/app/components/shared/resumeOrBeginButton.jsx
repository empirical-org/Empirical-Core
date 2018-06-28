import React from 'react'
const beginArrow = 'http://cdn.quill.org/images/icons/begin_arrow.svg';

const resumeOrBeginButton = props => (
  <button className="button student-begin" onClick={props.onClickFn}>
    {props.text}
    <img className="begin-arrow" src={beginArrow} />
  </button>)

export default resumeOrBeginButton
