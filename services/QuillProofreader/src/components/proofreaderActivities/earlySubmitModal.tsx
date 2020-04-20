import * as React from 'react'

const EarlySubmitModal: React.SFC<{closeModal: any, requiredEditCount: number}> = ({ closeModal, requiredEditCount, }) => {
 return (<div className="early-submit-modal-container">
   <div className="early-submit-modal-background" />
   <div className="early-submit-modal">
     <div className="top-section">
       <h1>Keep looking! You must make at least {requiredEditCount} edits.</h1>
       <button className="quill-button medium primary contained focus-on-light" onClick={closeModal} tabIndex={1}>Close</button>
     </div>
   </div>
 </div>)
}

export default EarlySubmitModal
