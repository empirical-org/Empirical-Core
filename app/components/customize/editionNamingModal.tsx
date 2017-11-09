import * as React from 'react'

const EditionNamingModal: React.SFC<any> = (props) => {
 return <div className="name-modal-container">
    <div className="name-modal-background" />
     <div className="name-modal">
        <img src ="https://assets.quill.org/images/illustrations/edition-published.svg"/>
        <h1>What would you like to name this lesson’s edition?</h1>
        <p className="explanation">You will see the name of your edition when you launch the lesson and it will help you identify this edition from the rest of the editions.</p>
        <div className="name-section">
          <p>Edition Name</p>
          <input value={props.name} onChange={props.updateName} placeholder="Enter a name for your edition"/>
        </div>
        <button className={props.buttonClassName} onClick={props.saveNameAndGoToCustomize}>Start Customizing</button>
     </div>
   </div>
}

export default EditionNamingModal
