import * as React from 'react'

import { Input, } from '../../../Shared/index'

import { requestPut } from '../../../../modules/request/index';

interface ResetStudentPasswordModalProps {
  close: () => void;
  onSuccess: (string) => void;
  student: any;
  classroom: any;
}

export default class ResetStudentPasswordModal extends React.Component<ResetStudentPasswordModalProps, {}> {
  constructor(props) {
    super(props)

    this.resetPassword = this.resetPassword.bind(this)
  }

  resetPassword() {
    const { onSuccess, close, student, classroom, } = this.props
    const user = { password: student.name.split(' ')[1] }
    requestPut(`/teachers/classrooms/${classroom.id}/students/${student.id}`, { user, }, (body) => {
      onSuccess('Password reset')
      close()
    })
  }

  render() {
    const { student } = this.props
    return (
      <div className="modal-container reset-student-password-modal-container">
        <div className="modal-background" />
        <div className="reset-student-password-modal quill-modal modal-body">
          <div>
            <h3 className="title">Reset a student's password</h3>
          </div>
          <p>When you reset a student's password, the new password is the student's last name.</p>
          <Input
            className="password"
            disabled={true}
            label="New password"
            type="text"
            value={student.name.split(' ')[1]}
          />
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
            <button className="quill-button primary contained medium" onClick={this.resetPassword}>Reset Password</button>
          </div>
        </div>
      </div>
    )
  }
}
