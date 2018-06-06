import * as React from 'react'

const NameAndSampleQuestionModal: React.SFC<any> = (props) => {
 return <div className="name-and-sample-question-modal-container">
    <div className="name-and-sample-question-modal-background" />
     <div className="name-and-sample-question-modal">
       <img onClick={props.closeEditModal} className="exit" src="http://assets.quill.org/images/icons/CloseIcon.svg"/>
        <img className="illustration" src ="https://assets.quill.org/images/illustrations/edition-published.svg"/>
        <h1>Edit Edition Name and Sample Question</h1>
        <p className="explanation">The name and sample question of the edition will help you identify this customized edition before you launch the lesson.</p>
        <div className="fields">
          <div className="name-section">
            <p>Edition Name</p>
            <input value={props.name} onChange={props.updateName} placeholder="Enter a name for this edition"/>
          </div>
          <div className="dividing-line"/>
          <div className="sample-question-section">
            <p>Edition Sample Question</p>
            <input value={props.sampleQuestion} onChange={props.updateSampleQuestion} placeholder="Enter a sample question for this edition"/>
          </div>
        </div>
        <button className={props.buttonClassName} onClick={props.closeEditModal}>Submit</button>
     </div>
   </div>
}

export default NameAndSampleQuestionModal
