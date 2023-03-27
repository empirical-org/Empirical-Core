import React from 'react';

import { requestPost } from '../../../../modules/request/index';

export default class MergeTeacherAccounts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      teacher1Identifier: '',
      teacher2Identifier: ''
    }
  }

  submitTeachers = () => {
    const that = this

    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_fix/merge_teacher_accounts`,
      { account1_identifier: that.state.teacher1Identifier, account2_identifier: that.state.teacher2Identifier },
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

  updateTeacherIdentifier = (e, teacherNumber) => {
    const key = `teacher${teacherNumber}Identifier`
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
        <h2>Merge Teacher Accounts</h2>
        <p>This method will transfer all of the first teacher's classrooms and created units to the second teacher.</p>
        <p>Please note that it will not delete the first teacher's account, nor impact the second teacher's premium status or other account information.</p>
        <div>
          <div className="input-row">
            <label>Teacher One Email Or Username:</label>
            <input onChange={(e) => this.updateTeacherIdentifier(e, 1)} type="text" value={this.state.teacher1Identifier} />
          </div>
          <div className="input-row">
            <label>Teacher Two Email Or Username:</label>
            <input onChange={(e) => this.updateTeacherIdentifier(e, 2)} type="text" value={this.state.teacher2Identifier} />
          </div>
          <button onClick={this.submitTeachers}>Merge Teacher Accounts</button>
          {this.renderError()}
        </div>

      </div>
    )
  }
}
