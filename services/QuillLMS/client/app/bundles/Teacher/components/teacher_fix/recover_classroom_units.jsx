import React from 'react'

import { requestPost, } from '../../../../modules/request/index'

export default class RecoverClassroomActivities extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classCode: ''
    }
  }

  submitClassCode = () => {
    const that = this

    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_fix/recover_classroom_units`,
      { class_code: that.state.classCode },
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

  updateClassCode = e => {
    this.setState({classCode: e.target.value})
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
        <h2>Recover Classroom Units</h2>
        <p>This method will unarchive all of the classroom units and associated activity sessions for a given classroom, as well as any units (activity packs) that are associated with these classroom units in the event that they have been hidden.</p>
        <div>
          <div className="input-row">
            <label>Class Code:</label>
            <input onChange={this.updateClassCode} type="text" value={this.state.classCode} />
          </div>
          <button onClick={this.submitClassCode}>Recover Classroom Units</button>
          {this.renderError()}
        </div>
      </div>
    )
  }
}
