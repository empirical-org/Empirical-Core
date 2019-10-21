import React from 'react'

const Question = (props) =>
  (<p>
    <span>{props.prompt}</span>
    <span onClick={props.cloneFunction} style={{ color: 'blue', fontWeight: 600, cursor: 'pointer', paddingLeft: '5px' }}>Clone</span>
  </p>)

export default Question
