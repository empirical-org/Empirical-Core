import React from 'react'

import { requestPost, } from '../../../../modules/request/index'

export default class MergeTwoClassrooms extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classCode1: '',
      classCode2: ''
    }
  }

  submitData = () => {
    const that = this

    requestPost(
      `${import.meta.env.DEFAULT_URL}/teacher_fix/merge_two_classrooms`,
      { class_code1: that.state.classCode1, class_code2: that.state.classCode2 },
      (body) => {
        window.alert('Classes have been merged!')
      },
      (body) => {
        if (body.error) {
          that.setState({error: body.error})
        }
      }
    )
  };

  updateClassCode = (e, classCodeNumber) => {
    const key = `classCode${classCodeNumber}`
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
        <h2>Merge Two Classrooms</h2>
        <p>This method will transfer all students and their data from the class identified by class code 1 to the class identified by class code 2.</p>
        <p>All teachers of the first class will be assigned to the second class as coteachers if they are not already the owner of the second class.</p>
        <p>Please note also that unstarted activities will not be transferred. All finished and started data will be moved.</p>
        <div>
          <div className="input-row">
            <label>Class Code 1:</label>
            <input onChange={(e) => this.updateClassCode(e, 1)} type="text" value={this.state.classCode1} />
          </div>
          <div className="input-row">
            <label>Class Code 2:</label>
            <input onChange={(e) => this.updateClassCode(e, 2)} type="text" value={this.state.classCode2} />
          </div>
          <button onClick={this.submitData}>Merge Classrooms</button>
          {this.renderError()}
        </div>

      </div>
    )
  }
}
