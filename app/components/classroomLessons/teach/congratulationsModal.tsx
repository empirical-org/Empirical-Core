import * as React from 'react'

const CongratulationsModal: React.SFC<{closeModal?: any}> = (props) => {
 return <div className="congratulations-modal-container">
      <div className="congratulations-modal-background"/>
     <div className="congratulations-modal">
        <img onClick={props.closeModal} className="exit" src="http://assets.quill.org/images/icons/CloseIcon.svg"/>
        <img className="illustration" src="http://assets.quill.org/images/illustrations/congratulations_illustration.svg" />
        <h1 className="congratulations">Congratulations!</h1>
        <h1>You've completed a Quill Lessons Activity.</h1>
        <p>This lesson will be marked as complete for your students.</p>
        <div className="dividing-line"/>
        <p>Your students' answers in this lesson are now saved in the <span>Activity Analysis</span> reports.</p>
        <button onClick={props.closeModal}>Got it!</button>
     </div>
   </div>
}

export default CongratulationsModal
