import * as React from 'react'
import { Input, Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'
import {CopyToClipboard} from 'react-copy-to-clipboard';

interface ClassCodeLinkProps {
  next: (event) => void;
  classroom: any;
}

interface ClassCodeLinkState {
  showSnackbar: boolean
}

export default class ClassCodeLink extends React.Component<ClassCodeLinkProps, ClassCodeLinkState> {
  constructor(props) {
    super(props)

    this.state = {
      showSnackbar: false
    }

    this.showSnackbar = this.showSnackbar.bind(this)
  }

  classCodeLink() {
    return `quill.org/join/${this.props.classroom.code}`
  }

  showSnackbar() {
    this.setState({ showSnackbar: true, }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  renderBody() {
    return <div className="create-a-class-modal-body modal-body">
      <h3 className="title">Share the class code link with your students</h3>
      <div className="copy-class-code-container">
        <Input
          id="class-code"
          disabled={true}
          value={this.classCodeLink()}
        />
        <CopyToClipboard text={this.classCodeLink()}>
          <button className="quill-button secondary outlined small" onClick={this.showSnackbar}>Copy</button>
        </CopyToClipboard>
      </div>
    </div>
  }

  renderFooter() {
    return <div className="create-a-class-modal-footer">
      <button className="quill-button primary contained medium" onClick={this.props.next}>Next</button>
    </div>
  }

  render() {
    return (
      <div className="create-a-class-modal-content">
        <Snackbar text="Class code link copied" visible={this.state.showSnackbar} />
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
