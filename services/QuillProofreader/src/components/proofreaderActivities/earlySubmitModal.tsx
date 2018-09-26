import * as React from 'react'

// const EarlySubmitModal: React.SFC<{closeModal: ((event: MouseEvent) => void), requiredEditCount:number}> = (props) => {
const EarlySubmitModal: React.SFC<{closeModal: any, requiredEditCount:number}> = (props) => {
 return <div className="early-submit-modal-container">
    <div className="early-submit-modal-background" />
     <div className="early-submit-modal">
       <div className="top-section">
          <h1>Keep Trying!</h1>
          <p>You must make at least {props.requiredEditCount} edits.</p>
          <button onClick={props.closeModal}>Find Edits</button>
        </div>
        </div>
     </div>
}

export default EarlySubmitModal
