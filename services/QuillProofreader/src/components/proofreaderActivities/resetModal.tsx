import * as React from 'react'

// const ResetModal: React.SFC<{closeModal: ((event: MouseEvent) => void), requiredEditCount:number}> = (props) => {
const ResetModal: React.SFC<{closeModal: any, reset: any}> = (props) => {
 return (<div className="reset-modal-container">
   <div className="reset-modal-background" />
   <div className="reset-modal">
     <div className="top-section">
       <h1>Reset the passage?</h1>
       <p>This will remove your edits and reset the passage to its original state.</p>
     </div>
     <div className="button-section">
       <button className="cancel" onClick={props.closeModal}>Cancel</button>
       <button className="reset" onClick={props.reset}>Reset</button>
     </div>
   </div>
 </div>)
}

export default ResetModal
