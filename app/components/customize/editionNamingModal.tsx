import * as React from 'react'

const EditionNamingModal: React.SFC<any> = (props) => {
 return <div className="name-modal-container">
    <div className="name-modal-background" />
     <div className="name-modal">
        <h1>What would you like to name this lesson’s edition?</h1>
        <p>You will see the name of your edition when you launch the lesson and it will help you identify this edition from the rest of the editions.</p>
        <div>
          <p>Edition Name</p>
          <input value={props.name} onChange={props.updateName}/>
        </div>
        <button onClick={props.saveNameAndGoToCustomize}>Start Customizing</button>
     </div>
   </div>
}

export default EditionNamingModal
