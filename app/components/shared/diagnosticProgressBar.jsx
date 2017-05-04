import React from 'react'

export default function DiagnosticProgressReport(props) {
  return (<progress className="progress diagnostic-progress" value={props.percent} max="100">15%</progress>)
}
