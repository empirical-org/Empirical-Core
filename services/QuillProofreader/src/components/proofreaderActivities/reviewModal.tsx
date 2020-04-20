import * as React from 'react'

const ReviewModal: React.SFC<{closeModal: any, numberOfErrors: number, numberOfCorrectChanges: number}> = ({ closeModal, numberOfErrors, numberOfCorrectChanges, }) => {
  const highScoreMessage = numberOfCorrectChanges > numberOfErrors / 2 ? "Good work! " : null
  return (<div className="review-modal-container">
   <div className="review-modal-background" />
   <div className="review-modal">
     <div className="top-section">
       <h1>{highScoreMessage} You found {numberOfCorrectChanges} of {numberOfErrors} errors.</h1>
       <button className="quill-button medium primary contained focus-on-light" onClick={closeModal} tabIndex={1}>Review</button>
     </div>
   </div>
  </div>)
}

export default ReviewModal
