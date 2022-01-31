import * as React from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Input, } from '../../../Shared/index'

interface ClassCodeLinkProps {
  next: (event) => void;
  back: (event) => void;
  showSnackbar: (event) => void;
  classroom: any;
}

interface ClassCodeLinkState {
  showSnackbar: boolean
}

export default class ClassCodeLink extends React.Component<ClassCodeLinkProps, ClassCodeLinkState> {
  constructor(props) {
    super(props)

    this.showSnackbar = this.showSnackbar.bind(this)
  }

  classCodeLink() {
    return `quill.org/join/${this.props.classroom.code}`
  }

  showSnackbar() {
    this.props.showSnackbar('Class code link copied')
  }

  renderBody() {
    return (
      <div className="create-a-class-modal-body modal-body">
        <h3 className="title">Share the class code link with your students</h3>
        <div className="copy-class-code-container">
          <Input
            disabled={true}
            id="class-code"
            value={this.classCodeLink()}
          />
          <CopyToClipboard onCopy={this.showSnackbar} text={this.classCodeLink()}>
            <button className="quill-button secondary outlined small">Copy</button>
          </CopyToClipboard>
        </div>
      </div>
    )
  }

  renderFooter() {
    const { back, next, } = this.props
    return (
      <div className="create-a-class-modal-footer with-back-button">
        <button className="quill-button secondary outlined medium" onClick={back}>Back</button>
        <button className="quill-button primary contained medium" onClick={next}>Next</button>
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
