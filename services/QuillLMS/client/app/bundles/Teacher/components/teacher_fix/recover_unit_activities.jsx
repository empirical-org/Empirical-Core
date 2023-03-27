import React from 'react';

import { requestPost } from '../../../../modules/request/index';

export default class RecoverUnitActivities extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
    }
  }

  submit = () => {
    const that = this
    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_fix/recover_unit_activities`,
      { email: that.state.email, },
      (body) => {
        window.alert('Data has been restored!')
      },
      (body) => {
        if (response.error) {
          that.setState({error: response.error})
        }
      }
    )
  };

  updateEmail = e => {
    this.setState({email: e.target.value})
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
        <h2>Recover Unit Activities</h2>
        <p>This method will unarchive all of the unit activities for all of the given teacher's non-archived units.</p>
        <div>
          <div className="input-row">
            <label>Teacher Email:</label>
            <input onChange={this.updateEmail} type="text" value={this.state.email} />
          </div>
          <button onClick={this.submit}>Recover Unit Activities</button>
          {this.renderError()}
        </div>
      </div>
    )
  }
}
