import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class RecoverClassroomActivities extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classCode: ''
    }

    this.submitClassCode = this.submitClassCode.bind(this)
    this.updateClassCode = this.updateClassCode.bind(this)
  }

  submitClassCode() {
    const that = this
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/recover_classroom_activities`,
      json: {class_code: that.state.classCode, authenticity_token: getAuthToken()}
    },
    (e, r, response) => {
      if (response.error) {
        that.setState({error: response.error})
      } else if (r.statusCode === 200){
        window.alert('Data has been restored!')
      } else {
        console.log(response)
      }
    })

  }

  updateClassCode(e) {
    this.setState({classCode: e.target.value})
  }

  renderError() {
    if (this.state.error) {
      return <p className="error">{this.state.error}</p>
    }
  }

  render() {
    return <div>
      <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
      <h2>Recover Classroom Activities</h2>
      <p>This method will unarchive all of the classroom activities and associated activity sessions for a given classroom, as well as any units (activity packs) that are associated with these classroom activities in the event that they have been hidden.</p>
      <div>
        <div className="input-row">
          <label>Class Code:</label>
          <input type="text" value={this.state.classCode} onChange={this.updateClassCode}/>
        </div>
        <button onClick={this.submitClassCode}>Recover Classroom Activities</button>
        {this.renderError()}
      </div>
    </div>
  }
}
