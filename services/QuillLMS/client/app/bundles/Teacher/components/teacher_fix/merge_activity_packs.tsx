import * as React from "react";

import { requestPost, } from '../../../../modules/request/index'

export default class MergeActivityPacks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activityPack1Id: '',
      activityPack2Id: ''
    }
  }

  submitStudents = () => {
    const that = this

    requestPost(
      `${import.meta.env.DEFAULT_URL}/teacher_fix/merge_activity_packs`,
      { from_activity_pack_id: that.state.activityPack1Id, to_activity_pack_id: that.state.activityPack2Id },
      (body) => {
        window.alert('Activity Packs have been merged!')
      },
      (body) => {
        if (body.error) {
          that.setState({error: body.error})
        }
      }
    )
  };

  updateActivityPackId = (e, activityPackNumber) => {
    const key = `activityPack${activityPackNumber}Id`
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
        <h2>Merge Activity Packs</h2>
        <p>This allows you to transfer all of the activities in one activity pack over to a second activity pack.</p>
        <p>All finished and started data will be moved.</p>
        <p>To find an activity pack's ID, go to the "My Activities" tab and click the "Add/remove students assigned" button underneath the activity pack's name. You will then find the ID (which is a number) in the URL.</p>
        <div>
          <div className="input-row">
            <label>From Activity Pack ID:</label>
            <input onChange={(e) => this.updateActivityPackId(e, 1)} type="text" value={this.state.activityPack1Id} />
          </div>
          <div className="input-row">
            <label>To Activity Pack ID:</label>
            <input onChange={(e) => this.updateActivityPackId(e, 2)} type="text" value={this.state.activityPack2Id} />
          </div>
          <button onClick={this.submitStudents}>Merge Activity Packs</button>
          {this.renderError()}
        </div>

      </div>
    )
  }
}
