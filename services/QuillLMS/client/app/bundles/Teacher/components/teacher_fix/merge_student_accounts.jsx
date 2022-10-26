import React from 'react'

import { requestPost, } from '../../../../modules/request/index'

export default class MergeStudentAccounts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      student1Identifier: '',
      student2Identifier: ''
    }
  }

  submitStudents = () => {
    const that = this

    requestPost(
      `${process.env.DEFAULT_URL}/teacher_fix/merge_student_accounts`,
      { account1_identifier: that.state.student1Identifier, account2_identifier: that.state.student2Identifier },
      (body) => {
        window.alert('Accounts have been merged!')
      },
      (body) => {
        if (body.error) {
          that.setState({error: body.error})
        }
      }
    )
  };

  updateStudentIdentifier = (e, studentNumber) => {
    const key = `student${studentNumber}Identifier`
    this.setState({[key]: e.target.value})
  };

  renderError() {
    if (this.state.error) {
      return <p className="error">{this.state.error}</p>
    }
  }

  render() {
    return (
      <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
        <h2>Merge Student Accounts</h2>
        <p>This method will not work unless both students are in the same classroom, and the second student only belongs to this classroom. If you need help with a different case, ask a dev.</p>
        <p>Also please note that this method will transfer all of the second student's activities to the first student's account. It will not, however, delete the second student's account or remove it from the classroom.</p>
        <div>
          <div className="input-row">
            <label>Student One Email Or Username:</label>
            <input onChange={(e) => this.updateStudentIdentifier(e, 1)} type="text" value={this.state.student1Identifier} />
          </div>
          <div className="input-row">
            <label>Student Two Email Or Username:</label>
            <input onChange={(e) => this.updateStudentIdentifier(e, 2)} type="text" value={this.state.student2Identifier} />
          </div>
          <button onClick={this.submitStudents}>Merge Student Accounts</button>
          {this.renderError()}
        </div>

      </div>
    )
  }
}
