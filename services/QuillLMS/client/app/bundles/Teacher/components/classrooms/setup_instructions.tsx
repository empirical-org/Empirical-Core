import * as React from 'react'
import { Input, Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const setupInstructionsSrc = `${process.env.CDN_URL}/images/Illustrations/setup-instructions.svg`

interface SetupInstructionsProps {
  close: (event) => void;
  classroom: any;
}

interface SetupInstructionsState {
}

export default class SetupInstructions extends React.Component<SetupInstructionsProps, SetupInstructionsState> {

  renderBody() {
    return <div className="create-a-class-modal-body modal-body setup-instructions">
      <h3 className="title">Download student logins and setup instructions</h3>
      <p>This PDF includes usernames and passwords for each student and instructions for accessing their Quill accounts.</p>
      <img src={setupInstructionsSrc} />
      <a href={`/teachers/classrooms/${this.props.classroom.id}/student_logins`} className="quill-button secondary outlined medium">Download PDF</a>
    </div>
  }

  renderFooter() {
    return <div className="create-a-class-modal-footer">
      <button className="quill-button primary contained medium" onClick={this.props.close}>Done</button>
    </div>
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
