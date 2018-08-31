import * as React from 'react'

const ReviewModal: React.SFC<{closeModal: any, numberOfErrors:number, numberOfCorrectChanges:number}> = (props) => {
 return <div className="review-modal-container">
    <div className="review-modal-background" />
     <div className="review-modal">
       <div className="top-section">
         <h1>Good work!</h1>
          <p>You found {props.numberOfCorrectChanges} of {props.numberOfErrors} errors.</p>
          <button onClick={props.closeModal}>Review Your Work</button>
        </div>
        </div>
     </div>
}

export default ReviewModal
