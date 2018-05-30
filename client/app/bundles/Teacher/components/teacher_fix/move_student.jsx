import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class MoveStudent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      studentIdentifier: '',
      classCode1: '',
      classCode2: ''
    }

    this.submitData = this.submitData.bind(this)
    this.updateClassCode = this.updateClassCode.bind(this)
    this.updateStudentIdentifier = this.updateStudentIdentifier.bind(this)
  }

  submitData() {
    const that = this
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/move_student_from_one_class_to_another`,
      json: {class_code_1: that.state.classCode1, class_code_2: that.state.classCode2, student_identifier: that.state.studentIdentifier, authenticity_token: getAuthToken()}
    },
    (e, r, response) => {
      if (response.error) {
        that.setState({error: response.error})
      } else if (r.statusCode === 200){
        window.alert('Student has been moved!')
      } else {
        console.log(response)
      }
    })
  }

  updateClassCode(e, classCodeNumber) {
    const key = `classCode${classCodeNumber}`
    this.setState({[key]: e.target.value})
  }

  updateStudentIdentifier(e) {
    this.setState({studentIdentifier: e.target.value})
  }

  renderError() {
    if (this.state.error) {
      return <p className="error">{this.state.error}</p>
    }
  }

  render() {
    return <div>
      <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
      <h2>Move Student From One Class to Another</h2>
      <p>This method will transfer a student and their data from the class identified by class code 1 to the class identified by class code 2.</p>
      <p>Please note that if the classes have different teachers, all of the student's activities in the second classroom will belong to a new unit that is separate from anything that teacher may have assigned to the rest of the class.</p>
      <p>Please note also that unstarted activities will not be transferred. All finished and started data will be moved.</p>
      <div>
        <div className="input-row">
          <label>Class Code 1:</label>
          <input type="text" value={this.state.classCode1} onChange={(e) => this.updateClassCode(e, 1)}/>
        </div>
        <div className="input-row">
          <label>Class Code 2:</label>
          <input type="text" value={this.state.classcode2} onChange={(e) => this.updateClassCode(e, 2)}/>
        </div>
        <div className="input-row">
          <label>Student Username or Email:</label>
          <input type="text" value={this.state.studentIdentifier} onChange={this.updateStudentIdentifier}/>
        </div>
        <button onClick={this.submitData}>Move Student</button>
        {this.renderError()}
      </div>

    </div>
  }
}
