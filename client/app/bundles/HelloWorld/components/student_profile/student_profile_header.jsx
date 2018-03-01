import React from 'react';
import createReactClass from 'create-react-class';

export default class StudentProfileHeader extends React.Component {
  constructor() {
    super()
  }

  render(){
    return(
      <div className="container student-profile-header">
        <div className="header">
          <span>{this.props.classroomName} | {this.props.teacherName}</span>
          <span>{this.props.studentName}</span>
        </div>
        <div className="dividing-line"/>
      </div>
    )
  }
}
