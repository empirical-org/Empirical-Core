import * as React from 'react'

const ProjectorModal: React.SFC<{closeModal: any}> = (props) => {
 return <div className="projector-modal-container">
     <div className="projector-modal">
        <img onClick={props.closeModal} className="exit" src="http://assets.quill.org/images/icons/CloseIcon.svg"/>
        <img className="illustration" src="http://assets.quill.org/images/illustrations/projector_modal.svg" />
        <h1><span>Next:</span> Project This Window</h1>
        <p>Drag this window to the projector and keep your teacher view on your computer’s screen only.</p>
        <p><span>Note:</span> If your projector mirrors your computer’s screen, then you need to <span>unmirror</span> your projector.</p>
        <a target="_blank" href="http://support.quill.org/activities-implementation/quill-lessons/how-do-i-project-quill-lessons">Learn How To Unmirror Projectors</a>
        <button onClick={props.closeModal}>Got it!</button>
     </div>
   </div>
}

export default ProjectorModal
