import * as React from 'react'

const ResetModal: React.SFC<{closeModal: any, reset: any}> = ({ closeModal, reset, }) => {
 return (<div className="reset-modal-container">
   <div className="reset-modal-background" />
   <div className="reset-modal">
     <div className="top-section">
       <h1>Reset the passage?</h1>
       <p>This will undo all the edits you made and reset the passage to its original state.</p>
     </div>
     <div className="button-section">
       <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} tabIndex={1}>Cancel</button>
       <button className="quill-button medium primary contained focus-on-light" onClick={reset}>Reset passage</button>
     </div>
   </div>
 </div>)
}

export default ResetModal
