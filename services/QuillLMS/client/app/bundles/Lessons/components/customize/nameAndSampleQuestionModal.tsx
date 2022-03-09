import * as React from 'react'

const NameAndSampleQuestionModal: React.SFC<any> = (props) => {
  return (
    <div className="name-and-sample-question-modal-container">
      <div className="name-and-sample-question-modal-background" />
      <div className="name-and-sample-question-modal">
        <button className="interactive-wrapper focus-on-light exit" onClick={props.closeEditModal} type="button"><img alt="Close icon" src="https://assets.quill.org/images/icons/CloseIcon.svg" /></button>
        <img alt="" className="illustration" src="https://assets.quill.org/images/illustrations/edition-published.svg" />
        <h1>Edit Edition Name and Sample Question</h1>
        <p className="explanation">The name and sample question of the edition will help you identify this customized edition before you launch the lesson.</p>
        <div className="fields">
          <div className="name-section">
            <p>Edition Name</p>
            <input onChange={props.updateName} placeholder="Enter a name for this edition" value={props.name} />
          </div>
          <div className="dividing-line" />
          <div className="sample-question-section">
            <p>Edition Sample Question</p>
            <input onChange={props.updateSampleQuestion} placeholder="Enter a sample question for this edition" value={props.sampleQuestion} />
          </div>
        </div>
        <button className={props.buttonClassName} onClick={props.closeEditModal}>Submit</button>
      </div>
    </div>
  )
}

export default NameAndSampleQuestionModal
