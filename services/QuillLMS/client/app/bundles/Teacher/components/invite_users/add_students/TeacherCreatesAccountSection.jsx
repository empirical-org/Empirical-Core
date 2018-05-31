import React from 'react'
import ButtonLoadingIndicator from '../../shared/button_loading_indicator'

export default class extends React.Component {

  addStudentButton() {
    return this.props.loading
    ? <button className='button-green'><ButtonLoadingIndicator/></button>
    : <button className='button-green' onClick={this.props.submitStudent}>Add Student</button>
  }

  render() {
    return (
      <div className="teacher-creates-accounts">
        <div className="option-boxes">
          <div className="box-section">
            <div className="box-top">
              <h1><span>Option 3:</span> Create Accounts for Your Students</h1>
            </div>
            <div className="box-content">
              <h2>Username:</h2>
              <p>The students' usernames are their names combined with your class code.</p>
              <p>For example, John Smith is <span>john.smith@prize-bait</span></p>
            </div>
          </div>
          <div className="box-section">
            <div className="box-top empty"></div>
            <div className="box-content">
              <h2>Password:</h2>
              <p>If you create a student account, the passwords are set to the students' last names by default.</p>
              <p>For example, John Smith's password would be <span>Smith</span>, with the first letter capitalized.</p>
            </div>
          </div>
        </div>
        <div className="add-student-section">
          <h2>Add Your Students</h2>
          <div className="input-row">
            <span className="group-together">
              <input className="name-input" placeholder='First Name' type="text" value={this.props.firstName} onChange={(e)=> this.props.nameChange(e, 'firstName')}/>
              <input className="name-input" placeholder='Last Name' type="text" value={this.props.lastName} onChange={(e)=> this.props.nameChange(e, 'lastName')}/>
              {this.addStudentButton()}
            </span>
            <a className="white-bg" href={'/teachers/classrooms/' + this.props.classID + '/student_logins.pdf'}>Download Login Sheet</a>
          </div>
          <div className="errors">{this.props.errors}</div>
        </div>
      </div>
    );
   }
 };
