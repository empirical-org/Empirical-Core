
import React from 'react'

import { requestPost, } from '../../../../modules/request/index'

const RecalculateStaggeredReleaseLocks = () => {
  const [teacherIdentifier, setTeacherIdentifier] = React.useState('')
  const [error, setError] = React.useState(null)

  function handleRecalculateStaggeredReleaseLocks() {
    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_fix/recalculate_staggered_release_locks`,
      { teacher_identifier: teacherIdentifier, },
      (body) => {
        setTeacherIdentifier('')
        setError(null)
        window.alert('Staggered Release Lock recalculation is underway.  Please wait a few minutes for this to complete.')
      },
      (body) => {
        setTeacherIdentifier('')
        setError('Teacher not found')
      }
    )
  }

  function handleTeacherIdentifierUpdate(e) {
    setTeacherIdentifier(e.target.value)
  };

  function renderTeacherIdentifierForm() {
    return (
      <div className="input-row">
        <label>
          Teacher Email Or Username:
          <input
            aria-label="Teacher Email Or Username"
            onChange={handleTeacherIdentifierUpdate}
            type="text"
            value={teacherIdentifier}
          />
        </label>
        <button onClick={handleRecalculateStaggeredReleaseLocks} type="button" >Recalculate</button>
      </div>
    )
  }

  function renderError() {
    if(error) {
      return <p className="error">{error}</p>
    }
  }

  function renderInstructions() {
    return (
      <p>
        For a given teacher, this fix will recalculate the Staggered Release locks of every student in all of that
        teacher's classrooms.
      </p>
    )
  }

  return (
    <div>
      <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
      <h2>Recalculate Staggered Release Locks</h2>
      {renderInstructions()}
      {renderTeacherIdentifierForm()}
      {renderError()}
    </div>
  )
}

export default RecalculateStaggeredReleaseLocks
