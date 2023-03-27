
import React from 'react'

import { requestPost } from '../../../../modules/request/index'

export default class RecalculateStaggeredReleaseLocks extends React.Component {
  state = {
    teacherIdentifier: '',
    error: null
  }

  handleRecalculateStaggeredReleaseLocks = () => {
    const { teacherIdentifier } = this.state

    requestPost(
      `${process.env.DEFAULT_URL}/teacher_fix/recalculate_staggered_release_locks`,
      { teacher_identifier: teacherIdentifier, },
      (body) => {
        this.setState({ teacherIdentifier: '', error: null})
        window.alert('Staggered Release Lock recalculation is underway.  Please wait a few minutes for this to complete.')
      },
      (body) => {
        this.setState({
          teacherIdentifier: '',
          error: 'Teacher not found',
        });
      }
    )
  }

  handleTeacherIdentifierUpdate = (e) => {
    this.setState({teacherIdentifier: e.target.value})
  };

  renderTeacherIdentifierForm() {
    const { teacherIdentifier } = this.state

    return (
      <div className="input-row">
        <label>
          Teacher Email Or Username:
          <input
            aria-label="Teacher Email Or Username"
            onChange={this.handleTeacherIdentifierUpdate}
            type="text"
            value={teacherIdentifier}
          />
        </label>
        <button onClick={this.handleRecalculateStaggeredReleaseLocks} type="button" >Recalculate</button>
      </div>
    )
  }

  renderError() {
    const { error } = this.state

    if(error) {
      return <p className="error">{error}</p>
    }
  }

  renderInstructions() {
    return (
      <p>
        For a given teacher, this fix will recalculate the Staggered Release locks of every student in all of that
        teacher's classrooms.
      </p>
    )
  }

  render() {
    return (
      <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
        <h2>Recalculate Staggered Release Locks</h2>
        {this.renderInstructions()}
        {this.renderTeacherIdentifierForm()}
        {this.renderError()}
      </div>
    )
  }
}
