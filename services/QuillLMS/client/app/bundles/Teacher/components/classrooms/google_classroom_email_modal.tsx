import * as React from 'react'

import { Input } from 'quill-component-library/dist/componentLibrary'

import { requestPut } from '../../../../modules/request/index.js';

interface GoogleClassroomEmailModalProps {
  close: () => void;
  onSuccess: (string) => void;
  user: any;
}

interface GoogleClassroomEmailModalState {
  email: string;
  timesSubmitted: number;
  errors: { [key:string]: string };
}

export default class GoogleClassroomEmailModal extends React.Component<GoogleClassroomEmailModalProps, GoogleClassroomEmailModalState> {
  constructor(props) {
    super(props)

    this.state = {
      username: props.user.email,
      errors: {},
      timesSubmitted: 0
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.updateEmail = this.updateEmail.bind(this)
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value })
  }

  updateEmail() {
    const { onSuccess, close, } = this.props
    const { email, } = this.state
    const dataForUserUpdate = {
      email,
      school_options_do_not_apply: true
    };

    requestPut('/teachers/update_my_account', dataForUserUpdate, (body) => {
      onSuccess('Email updated')
    })
  }

  submitButtonClass() {
    const { user } = this.props
    const { email } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!email.length || user.email === email) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  render() {
    const { email, errors, timesSubmitted } = this.state
    return <div className="modal-container google-classroom-email-modal-container">
      <div className="modal-background" />
      <div className="google-classroom-email-modal modal modal-body">
        <div>
          <h3 className="title">Edit your student account</h3>
        </div>
        <Input
          label="New Quill email"
          value={email}
          handleChange={this.handleEmailChange}
          type="text"
          className="email"
          error={errors.email}
          timesSubmitted={timesSubmitted}
          characterLimit={50}
        />
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.updateEmail}>Save</button>
        </div>
      </div>
    </div>
  }
}
