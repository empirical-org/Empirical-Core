import * as React from 'react'

import { removeIcon, } from '../../../Shared/index'

const DisplayStudentHighlight = ({ studentHighlight, removeHighlight, }) => {
  function handleClickRemove() { removeHighlight(studentHighlight)}

  return (<div className="display-student-highlight">
    <span>{studentHighlight}</span>
    <button className="interactive-wrapper focus-on-light" onClick={handleClickRemove} type="button"><img alt={removeIcon.alt} src={removeIcon.src} /></button>
  </div>)
}

export default DisplayStudentHighlight
