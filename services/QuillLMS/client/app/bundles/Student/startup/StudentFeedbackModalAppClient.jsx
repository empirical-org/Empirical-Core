import * as React from 'react'

import { TextArea } from '../../Shared/index'
import { requestPost } from '../../../modules/request/index';

const StudentFeedbackModal = ({ question, gradeLevels, }) => {
  const [response, setResponse] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  function updateResponse(e) {
    setResponse(e.target.value)
  }

  function cancel(e) {
    e.preventDefault()
    document.getElementById('student-feedback-modal-component').style.display = 'none'
    setResponse('')
  }

  function handleClickSave(e) {
    e.preventDefault()
    if (submitting) { return }

    setSubmitting(true)
    requestPost('/student_feedback_responses', { student_feedback_response: { question, response, grade_levels: gradeLevels } }, () => {
      document.getElementById('student-feedback-modal-component').style.display = 'none'
      document.cookie = `student_feedback_banner_1_closed=1; path=/`;
      document.getElementById('student-feedback-banner').style.display = 'none';
      setResponse('')
    })
  }

  let saveButtonClass = 'quill-button contained primary medium focus-on-light';
  if (!response.length || submitting) {
    saveButtonClass += ' disabled';
  }

  return (
    <div className="student-feedback-modal-container" id="student-feedback-modal-component">
      <div className="modal-background" />
      <div className="student-feedback-modal">
        <h1>{question}</h1>
        <p>Please help us to improve Quill by typing your response below. Your response won&#39;t be made public.</p>
        <form acceptCharset="UTF-8" >
          <TextArea
            characterLimit={1000}
            handleChange={updateResponse}
            label=''
            timesSubmitted={0}
            value={response}
          />
          <div className="buttons">
            <button className="quill-button medium secondary outlined focus-on-light" onClick={cancel} type="button">Cancel</button>
            <button className={saveButtonClass} onClick={handleClickSave} type="button">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentFeedbackModal
