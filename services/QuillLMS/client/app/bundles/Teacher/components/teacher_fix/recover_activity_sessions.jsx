import React from 'react'

import { requestPost, } from '../../../../modules/request/index'

export default class RecoverClassroomActivities extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      unitName: ''
    }
  }

  submit = () => {
    const that = this

    requestPost(
      `${process.env.DEFAULT_URL}/teacher_fix/recover_activity_sessions`,
      {email: that.state.email, unit_name: that.state.unitName},
      (body) => {
        window.alert('Data has been restored!')
      },
      (body) => {
        if (body.error) {
          that.setState({error: body.error})
        }
      }
    )
  };

  updateEmail = e => {
    this.setState({email: e.target.value})
  };

  updateUnitName = e => {
    this.setState({unitName: e.target.value})
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
        <h2>Recover Activity Sessions</h2>
        <p>This method will unarchive all of the activity sessions for a given unit that may have been accidentally unassigned.</p>
        <div>
          <div className="input-row">
            <label>Teacher Email:</label>
            <input onChange={this.updateEmail} type="text" value={this.state.email} />
          </div>
          <div className="input-row">
            <label>Unit Name:</label>
            <input onChange={this.updateUnitName} type="text" value={this.state.unitName} />
          </div>
          <button onClick={this.submit}>Recover Activity Sessions</button>
          {this.renderError()}
        </div>
      </div>
    )
  }
}
