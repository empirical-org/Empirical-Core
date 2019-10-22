import React from 'react'

const DiagnosticProgressBar = props => (
  <progress className="progress diagnostic-progress" max="100" value={props.percent}>15%</progress>)

export { DiagnosticProgressBar }
