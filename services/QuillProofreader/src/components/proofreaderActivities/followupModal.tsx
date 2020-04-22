import * as React from 'react'

const FollowupModal: React.SFC<{goToLMS: any, goToFollowupPractice: any}> = ({ goToLMS, goToFollowupPractice, }) => {
 return (<div className="followup-modal-container">
   <div className="followup-modal-background" />
   <div className="followup-modal">
     <div className="top-section">
       <h1>That&#39;s the end of this passage! Now let&#39;s do some follow-up practice.</h1>
     </div>
     <div className="button-section">
       <button className="quill-button medium secondary outlined focus-on-light" onClick={goToLMS} tabIndex={1} type="button">Save and exit</button>
       <button className="quill-button medium primary contained focus-on-light" onClick={goToFollowupPractice} type="button">Begin</button>
     </div>
   </div>
 </div>)
}

export default FollowupModal
