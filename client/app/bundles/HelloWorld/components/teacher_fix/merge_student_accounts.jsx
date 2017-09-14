import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class MergeStudentAccounts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      student1Identifier: '',
      student2Identifier: ''
    }

    this.submitStudents = this.submitStudents.bind(this)
    this.updateStudentIdentifier = this.updateStudentIdentifier.bind(this)
  }

  submitStudents() {
    const that = this
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/merge_student_accounts`,
      json: {account_1_identifier: that.state.student1Identifier, account_2_identifier: that.state.student2Identifier, authenticity_token: getAuthToken()}
    },
    (e, r, response) => {
      if (response.error) {
        that.setState({error: response.error})
      } else if (r.statusCode === 200){
        window.alert('Accounts have been merged!')
      } else {
        console.log(response)
      }
    })
  }

  updateStudentIdentifier(e, studentNumber) {
    const key = `student${studentNumber}Identifier`
    this.setState({[key]: e.target.value})
  }

  render() {
    return <div>
      <p>Note: Do not use this unless both students are in the same classroom, and the second student only belongs to this classroom. If you need help with a different case, ask a dev.</p>
      <div>
        <div>
          <label>Student One Email Or Username:</label>
          <input type="text" value={this.state.student1Identifier} onChange={(e) => this.updateStudentIdentifier(e, 1)}/>
        </div>
        <div>
          <label>Student Two Email Or Username:</label>
          <input type="text" value={this.state.student2Identifier} onChange={(e) => this.updateStudentIdentifier(e, 2)}/>
        </div>
        <button onClick={this.submitStudents}>Merge Student Accounts</button>
        {this.state.error}
      </div>

    </div>
  }
}
