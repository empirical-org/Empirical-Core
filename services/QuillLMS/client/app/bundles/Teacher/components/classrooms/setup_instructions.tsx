import * as React from 'react'

const setupInstructionsSrc = `${process.env.CDN_URL}/images/illustrations/setup-instructions.svg`
const setupInstructionsGenericSrc = `${process.env.CDN_URL}/images/illustrations/setup-instructions-generic.svg`

const classCodeLinksPdf = `${process.env.CDN_URL}/documents/setup_instructions_pdfs/class_code_links.pdf`

interface SetupInstructionsProps {
  close: (event) => void;
  back: (event) => void;
  classroom: any;
}

interface SetupInstructionsState {
}

export default class SetupInstructions extends React.Component<SetupInstructionsProps, SetupInstructionsState> {

  renderBody() {
    const { classroom } = this.props
    let downloadLink = classCodeLinksPdf
    let imageSrc = setupInstructionsGenericSrc
    let download = true
    if (classroom.students && classroom.students.length) {
      downloadLink = `/teachers/classrooms/${classroom.id}/student_logins`
      imageSrc = setupInstructionsSrc
      download = false
    }
    return (<div className="create-a-class-modal-body modal-body setup-instructions">
      <h3 className="title">Download student logins and setup instructions</h3>
      <p>This PDF includes usernames and passwords for each student and instructions for accessing their Quill accounts.</p>
      <a download={download} href={downloadLink} target="_blank"><img src={imageSrc} /></a>
      <a className="quill-button secondary outlined medium" download={download} href={downloadLink} target="_blank">Download PDF</a>
    </div>)
  }

  renderFooter() {
    const { back, close, } = this.props
    return (<div className="create-a-class-modal-footer with-back-button">
      <button className="quill-button secondary outlined medium" onClick={back}>Back</button>
      <button className="quill-button primary contained medium" onClick={close}>Done</button>
    </div>)
  }

  render() {
    return (
      <div className="create-a-class-modal-content">
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
