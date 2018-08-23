import React from 'react'

const Question = (props) =>
  <p>
    <span>{props.prompt}</span>
    <span style={{ color: 'blue', fontWeight: 600, cursor: 'pointer', paddingLeft: '5px' }} onClick={props.cloneFunction}>Clone</span>
  </p>

export default Question
