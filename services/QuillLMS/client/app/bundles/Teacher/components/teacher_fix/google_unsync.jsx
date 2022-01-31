import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class GoogleUnsync extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      originalEmail: '',
      newEmail: '',
      password: ''
    }
  }

  submit = () => {
    const that = this
    request.put({
      url: `${process.env.DEFAULT_URL}/teacher_fix/google_unsync_account`,
      json: {original_email: that.state.originalEmail,
        new_email: that.state.newEmail,
        password: that.state.password,
        authenticity_token: getAuthToken()}
    },
    (e, r, response) => {
      if (response.error) {
        that.setState({error: response.error})
      } else if (r.statusCode === 200){
        window.alert('User has been unsynced!')
      } else {
        // to do, use Sentry to capture error
      }
    })
  };

  updateField = (e, key) => {
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
        <h2>Unsync Account with Google Classroom</h2>
        <p>This method will sever an account's connection with Google Classroom, allowing them to log in normally.</p>
        <p>The new email field is optional, and can be left blank if the user does not wish to change their email.</p>
        <div>
          <div className="input-row">
            <label>Google Classroom Email:</label>
            <input onChange={(e) => this.updateField(e, 'originalEmail')} type="text" value={this.state.originalEmail} />
          </div>
          <div className="input-row">
            <label>New Email:</label>
            <input onChange={(e) => this.updateField(e, 'newEmail')} type="text" value={this.state.newEmail} />
          </div>
          <div className="input-row">
            <label>Password:</label>
            <input onChange={(e) => this.updateField(e, 'password')} type="text" value={this.state.password} />
          </div>
          <button onClick={this.submit}>Unsync</button>
          {this.renderError()}
        </div>

      </div>
    )
  }
}
