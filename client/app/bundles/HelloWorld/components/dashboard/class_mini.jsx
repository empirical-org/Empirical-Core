import React from 'react';
export default React.createClass({

  manageClassGear() {
    return (
      <a className="pull-right class-mini-edit-students" href={this.manageClassLink()}>
        <span><img src="/images/person_icon.svg" />Edit Students</span>
      </a>
    );
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
