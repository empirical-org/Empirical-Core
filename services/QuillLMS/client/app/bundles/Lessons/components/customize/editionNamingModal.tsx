import * as React from 'react'

const EditionNamingModal: React.SFC<any> = (props) => {
  return (
    <div className="name-modal-container">
      <div className="name-modal-background" />
      <div className="name-modal">
        <button className="interactive-wrapper focus-on-light exit" onClick={props.deleteNewEdition} type="button"><img alt="Close icon" src="https://assets.quill.org/images/icons/CloseIcon.svg" /></button>
        <img alt="" className="illustration" src="https://assets.quill.org/images/illustrations/edition-published.svg" />
        <h1>Name this edition of the lesson</h1>
        <p className="explanation">You will see the name of your edition when you launch the lesson and it will help you identify this edition from the rest of the editions.</p>
        <div className="name-section">
          <p>Edition Name</p>
          <input onChange={props.updateName} placeholder="Enter a name for your edition" value={props.name} />
        </div>
        <button className={props.buttonClassName} onClick={props.saveNameAndGoToCustomize}>Start Customizing</button>
        <span className="cancel" onClick={props.deleteNewEdition}>Cancel Customization</span>
      </div>
    </div>
  )
}

export default EditionNamingModal
