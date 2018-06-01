import React from 'react'
import beginArrow from '../../img/begin_arrow.svg';

const resumeOrBeginButton = props => (
  <button className="button student-begin" onClick={props.onClickFn}>
    {props.text}
    <img className="begin-arrow" src={beginArrow} />
  </button>)

export default resumeOrBeginButton
