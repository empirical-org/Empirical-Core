import * as React from 'react'

import { removeIcon, } from '../../../Shared/index'

const DisplayStudentHighlight = ({ studentHighlight, removeHighlight, inReflection, }) => {
  function handleClickRemove() { removeHighlight(studentHighlight)}

  return (
    <div className="display-student-highlight">
      <span>{studentHighlight}</span>
      {inReflection ? <span /> : <button aria-label={`Remove highlight from the following sentence: ${studentHighlight}`} className="interactive-wrapper focus-on-light" onClick={handleClickRemove} type="button"><img alt={removeIcon.alt} src={removeIcon.src} /></button>}
    </div>
  )
}

export default DisplayStudentHighlight
