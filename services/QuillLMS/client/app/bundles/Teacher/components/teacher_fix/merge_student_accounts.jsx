import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class MergeStudentAccounts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      sourceStudentIdentifier: '',
      destinationStudentIdentifier: ''
    }
  }

  submitStudents = () => {
    const that = this
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/merge_student_accounts`,
      json: {
        source_student_identifier: that.state.sourceStudentIdentifier,
        destination_student_identifier: that.state.destinationStudentIdentifier,
        authenticity_token: getAuthToken()
      }
    },
    (e, r, response) => {
      if (response.error) {
        that.setState({error: response.error})
      } else if (r.statusCode === 200){
        window.alert('Accounts have been merged!')
      } else {
        // to do, use Sentry to capture error
      }
    })
  };

  updateStudentIdentifier = (e, identifier) => {
    this.setState({[identifier]: e.target.value})
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
        <p>Also please note that this method will transfer all of the first student's activities to the second student's account. It will not, however, delete the first student's account or remove it from the classroom.</p>
        <div>
          <div className="input-row">
            <label>Source Student Email Or Username:</label>
            <input onChange={(e) => this.updateStudentIdentifier(e, 'sourceStudentIdentifier')} type="text" value={this.state.sourceStudentIdentifier} />
          </div>
          <div className="input-row">
            <label>Destination / combined Student Email Or Username:</label>
            <input onChange={(e) => this.updateStudentIdentifier(e, 'destinationStudentIdentifier')} type="text" value={this.state.destinationStudentIdentifier} />
          </div>
          <button onClick={this.submitStudents}>Merge Student Accounts</button>
          {this.renderError()}
        </div>

      </div>
    )
  }
}
