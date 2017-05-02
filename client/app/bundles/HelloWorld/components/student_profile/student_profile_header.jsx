import React from 'react'

export default class StudentProfileHeader extends React.Component {
  constructor() {
    super()
  }

  render(){
    return(
      <div className="container student-profile-header">
        <div className="header">
          <span>{this.props.studentName}</span>
          <span>{this.props.classroomName} | {this.props.teacherName}</span>
        </div>
        <div className="dividing-line"/>
      </div>
    )
  }
}
