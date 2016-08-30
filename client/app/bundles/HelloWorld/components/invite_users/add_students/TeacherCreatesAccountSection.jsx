import React from 'react'

export default React.createClass({


  render: function() {
    return (
      <div>
        <h1 className="section-header">
          Or You Create Student Accounts
        </h1>
        <div>
          The students’ usernames are their names combined with your<br/>class code. For example, John Smith is 'John.Smith@prize-bait'.<br/>
          <div className="mt-15">
            Students passwords are set to their last names by default.<br/>For example, ‘Smith’ (first letter is capitalized).
          </div>
          <div className="add-student-fields">
            <input  placeholder='First Name' type="text" value={this.props.firstName} onChange={(e)=> this.props.nameChange(e, 'firstName')}/>
            <input  placeholder='Last Name' type="text" value={this.props.lastName} onChange={(e)=> this.props.nameChange(e, 'lastName')}/>
            <button className={`button-green`} onClick={this.props.submitStudent}>Add Student</button>
            <span className="errors">{this.props.errors}</span>
          </div>
        </div>
      </div>
    );
   }
 });
