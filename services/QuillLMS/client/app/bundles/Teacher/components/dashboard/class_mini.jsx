import React from 'react';
import { Tooltip } from 'quill-component-library/dist/componentLibrary'

const editSrc = `${process.env.CDN_URL}/images/icons/edit.svg`

export default class ClassMini extends React.Component {
  manageClassGear = () => {
    return (
      <a className="class-mini-edit-link" href={this.manageClassLink()}>
        <img alt="pencil-icon" src={editSrc} />
      </a>
    );
  };

  manageClassLink = () => {
    const classId = this.props.classObj.id.toString();
    return (`/teachers/classrooms?classroom=${classId}#${classId}`);
  };

  inviteStudentsLink = () => {
    const classId = this.props.classObj.id.toString();
    return (`/teachers/classrooms?modal=invite-students&classroom=${classId}#${classId}`);
  };

  studentCount = () => {
    if (Number(this.props.classObj.student_count) !== 0) {
      return (`${this.props.classObj.student_count} Students`);
    }
  };

  activityCount = () => {
    if (Number(this.props.classObj.activities_completed) !== 0) {
      return (`${this.props.classObj.activity_count} Activities Completed`);
    }
  };

  classroomSpecificReportLink = () => {
    return `/teachers/classrooms/scorebook?classroom_id=${this.props.classObj.id}`;
  };

  renderCode() {
    const { classObj, } = this.props
    const { code, google_classroom_id, clever_id, } = classObj
    if (google_classroom_id) {
      return (<Tooltip
        tooltipText="Add students by syncing with Google Classroom. No class code needed!"
        tooltipTriggerText="Class Code: N/A"
      />)
    }

    if (clever_id) {
      return (<Tooltip
        tooltipText="Add students here by adding students to Clever. No class code needed!"
        tooltipTriggerText="Class Code: N/A"
      />)
    }

    return <p>Class Code: {code}</p>
  }

  classroomSpecificButton = () => {
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
  };

  classroomMini = () => {
    return (
      <div>
        {this.manageClassGear()}
        <img className="class_icon" src="/class_icon.png" />
        <a href={this.classroomSpecificReportLink()}><h3 className="classroom_name">
          {this.props.classObj.name}</h3></a>
        <div className="classMetaData text-center">
          {this.renderCode()}
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
  };

  render() {
    return (
      <div className={'mini_container col-md-4 col-sm-5 text-center'}>
        <div className={'mini_content class-mini'}>
          {this.classroomMini()}
        </div>
      </div>
    );
  }
}
