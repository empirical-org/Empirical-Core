import React from 'react'

const DiagnosticProgressBar = props => (
  <progress className="progress diagnostic-progress" value={props.percent} max="100">15%</progress>)

export default DiagnosticProgressBar
