import React from 'react';
export default React.createClass({

  manageClassGear() {
    return (
      <div className="class-mini-top">
        {this.viewCoteachers()}
        <a className="class-mini-edit-students" href={this.manageClassLink()}>
          <p><img src="/images/person_icon.svg" alt="person-icon"/><span>Edit Students</span></p>
        </a>
      </div>
    );
  },

  viewCoteachers() {
    let link
    if (this.props.classObj.has_coteacher) {
      link = this.props.classObj.teacher_role === 'owner' ? '/teachers/classrooms#my-coteachers' : '/teachers/classrooms#active-classes'
      return <a href={link}>View Co-Teachers</a>
    } else {
      link = '/teachers/classrooms#invite-coteachers'
      return <a href={link}>Add Co-Teachers</a>
    }
  },

  manageClassLink() {
    const classId = this.props.classObj.id.toString();
    return (`/teachers/classrooms/${classId}/students`);
  },

  inviteStudentsLink() {
    const classId = this.props.classObj.id.toString();
    return ('/teachers/classrooms/invite_students');
  },

  studentCount() {
    if (this.props.classObj.students !== 0) {
      return (`${this.props.classObj.student_count} Students`);
    }
  },

  activityCount() {
    if (this.props.classObj.activities_completed !== 0) {
      return (`${this.props.classObj.activity_count} Activities Completed`);
    }
  },

  classroomSpecificReportLink() {
    return `/teachers/classrooms/scorebook?classroom_id=${this.props.classObj.id}`;
  },

  classroomSpecificButton() {
    if (!this.studentCount()) {
      return (
        <a href={this.inviteStudentsLink()}>
          <button className="button-green">Invite Students</button>
        </a>
      );
    } else if (!this.activityCount()) {
      return (
        <a href="/teachers/classrooms/activity_planner?tab=exploreActivityPacks">
          <button className="button-green">Assign Activities</button>
        </a>
      );
    }
    return (
      <a href={this.classroomSpecificReportLink()}>
        <button className="button-white class-mini-btn">View Results</button>
      </a>
    );
  },

  classroomMini() {
    return (
      <div>
        {this.manageClassGear()}
        <img className="class_icon" src="/class_icon.png" />
        <a href={this.classroomSpecificReportLink()}><h3 className="classroom_name">
          {this.props.classObj.name}</h3></a>
        <div className="classMetaData text-center">
          <p>
            Class Code: {this.props.classObj.code}</p>
          <p>
            {this.studentCount()}
          </p>
          <p>
            <b>{this.activityCount()}</b>
          </p>
        </div>
        {this.classroomSpecificButton()}
      </div>
    );
  },

  render() {
    return (
      <div className={'mini_container col-md-4 col-sm-5 text-center'}>
        <div className={'mini_content '}>
          {this.classroomMini()}
        </div>
      </div>
    );
  },
});
