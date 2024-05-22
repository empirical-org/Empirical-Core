import * as React from 'react';

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
    let downloadHref = classCodeLinksPdf
    let imageSrc = setupInstructionsGenericSrc
    let download = true
    if (classroom.students && classroom.students.length) {
      downloadHref = `/teachers/classrooms/${classroom.id}/student_logins`
      imageSrc = setupInstructionsSrc
      download = false
    }
    /* eslint-disable react/jsx-no-target-blank */
    const downloadImgLink = <a download={download} href={downloadHref} rel="noopener noreferrer" target="_blank"><img alt="" src={imageSrc} /></a>
    const downloadLink = <a className="quill-button secondary outlined medium" download={download} href={downloadHref} target="_blank">Download PDF</a>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div className="create-a-class-modal-body modal-body setup-instructions">
        <h3 className="title">Download student logins and setup instructions</h3>
        <p>This PDF includes usernames and passwords for each student and instructions for accessing their Quill accounts.</p>
        {downloadImgLink}
        {downloadLink}
      </div>
    )
  }

  renderFooter() {
    const { back, close, } = this.props
    return (
      <div className="create-a-class-modal-footer with-back-button">
        <button className="quill-button secondary outlined medium" onClick={back} type="button">Back</button>
        <button className="quill-button primary contained medium" onClick={close} type="button">Done</button>
      </div>
    )
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
